import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } from '$env/static/private';
import type { Game, GalleryImage } from '$lib/types/gallery';

const client = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY
	}
});

const BUCKET = 'photomode';

export interface R2Image {
	/** Full R2 key e.g. "kingdom-come-deliverance-ii/2026-01-26-18-43-41-1440w.avif" */
	key: string;
	/** Game slug e.g. "kingdom-come-deliverance-ii" */
	game: string;
	/**
	 * Base name without width suffix or extension.
	 * e.g. "2026-01-26-18-43-41"
	 * Used to group all sizes/formats of the same image together.
	 */
	baseName: string;
	/** Width in pixels */
	width: 640 | 960 | 1280 | 1440;
	/** File format */
	format: 'avif' | 'webp';
}

/**
 * Parses an R2 key into its constituent parts.
 * Returns null if the key doesn't match the expected naming convention.
 * Expected format: {game-slug}/{basename}-{width}w.{ext}
 */
function parseKey(key: string): R2Image | null {
	const match = key.match(/^([^/]+)\/(.+)-(\d+)w\.(avif|webp)$/);
	if (!match) return null;

	const [, game, baseName, widthStr, format] = match;
	const width = parseInt(widthStr, 10);

	if (![640, 960, 1280, 1440].includes(width)) return null;

	return {
		key,
		game,
		baseName,
		width: width as R2Image['width'],
		format: format as R2Image['format']
	};
}

/**
 * Lists all objects in the bucket, handling pagination automatically.
 * Returns a map of game slugs to their unique image base names.
 */
export async function listGames(): Promise<Game[]> {
	const allKeys: string[] = [];
	let continuationToken: string | undefined;

	// R2 returns max 1000 objects per request — paginate until done
	do {
		const response = await client.send(
			new ListObjectsV2Command({
				Bucket: BUCKET,
				ContinuationToken: continuationToken
			})
		);

		for (const obj of response.Contents ?? []) {
			if (obj.Key) allKeys.push(obj.Key);
		}

		continuationToken = response.NextContinuationToken;
	} while (continuationToken);

	// Parse keys and group by game, tracking formats per baseName
	const gameMap = new Map<string, Map<string, { hdr: boolean; sdr: boolean }>>();

	for (const key of allKeys) {
		const parsed = parseKey(key);
		if (!parsed) continue;

		if (!gameMap.has(parsed.game)) {
			gameMap.set(parsed.game, new Map());
		}
		const imageMap = gameMap.get(parsed.game)!;

		if (!imageMap.has(parsed.baseName)) {
			imageMap.set(parsed.baseName, { hdr: false, sdr: false });
		}
		const formats = imageMap.get(parsed.baseName)!;
		if (parsed.format === 'avif') formats.hdr = true;
		if (parsed.format === 'webp') formats.sdr = true;
	}

	return Array.from(gameMap.entries()).map(
		([slug, imageMap]): Game => ({
			id: slug,
			title: '',
			description: '',
			images: Array.from(imageMap.entries())
				.sort(([a], [b]) => a.localeCompare(b))
				.map(
					([baseName, formats]): GalleryImage => ({
						display: true,
						id: baseName,
						caption: '',
						alt: '',
						hdr: formats.hdr,
						sdr: formats.sdr,
						nsfw: false
					})
				)
		})
	);
}
