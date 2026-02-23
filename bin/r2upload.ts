// scripts/upload-to-r2.ts
// Uploads processed export images from local game folders to Cloudflare R2.
// Usage: npx tsx scripts/upload-to-r2.ts [--game "game name"]
//
// Prerequisites:
//   npm install @aws-sdk/client-s3

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { readdir, readFile } from 'fs/promises';
import { join, extname, basename } from 'path';

/** Supported export file extensions to upload */
const SUPPORTED_EXTENSIONS = new Set(['.avif', '.webp']);

/** R2 bucket name */
const BUCKET = 'photomode';

/**
 * Supported MIME types by file extension.
 * Required for correct Content-Type headers in R2/browser.
 */
const MIME_TYPES: Record<string, string> = {
	'.avif': 'image/avif',
	'.webp': 'image/webp'
};

/**
 * Normalises a game folder name to a URL-safe R2 prefix.
 * e.g. "Kingdom Come: Deliverance II" → "kingdom-come-deliverance-ii"
 */
function toR2Prefix(folderName: string): string {
	return folderName
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/**
 * Normalises a filename to be URL-safe, preserving the width suffix and extension.
 * e.g. "2026.01.26-18.43.41.56-1440w.avif" → "2026-01-26-18-43-41-56-1440w.avif"
 */
function toSafeFilename(filename: string): string {
	const ext = extname(filename);
	const name = basename(filename, ext);
	const safeName = name
		.toLowerCase()
		.replace(/[^a-z0-9-]+/g, '-')
		.replace(/--+/g, '-')
		.replace(/^-|-$/g, '');
	return `${safeName}${ext}`;
}

/**
 * Uploads all supported files from a single game's exports folder to R2.
 * Files are uploaded to: {game-slug}/{filename}
 */
async function uploadGameExports(
	client: S3Client,
	photoModeRoot: string,
	gameFolderName: string
): Promise<void> {
	const exportsPath = join(photoModeRoot, gameFolderName, 'exports');
	const r2Prefix = toR2Prefix(gameFolderName);

	let files: string[];
	try {
		files = await readdir(exportsPath);
	} catch {
		console.warn(`  ⚠️  No exports folder found for "${gameFolderName}", skipping.`);
		return;
	}

	const imageFiles = files.filter((f) => SUPPORTED_EXTENSIONS.has(extname(f).toLowerCase()));

	if (imageFiles.length === 0) {
		console.log(`  No supported files found in "${exportsPath}".`);
		return;
	}

	console.log(`\n📁 ${gameFolderName} → r2://${BUCKET}/${r2Prefix}/`);
	console.log(`   ${imageFiles.length} file(s) to upload\n`);

	const colWidth = Math.max(...imageFiles.map((f) => f.length));

	for (const filename of imageFiles) {
		const localPath = join(exportsPath, filename);
		const r2Key = `${r2Prefix}/${toSafeFilename(basename(filename))}`;
		const contentType = MIME_TYPES[extname(filename).toLowerCase()];
		const label = `   ${filename.padEnd(colWidth)}`;

		try {
			// Check if file already exists in R2 — skip if so
			await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: r2Key }));
			console.log(`${label}  ⏭️  skipped`);
			continue;
		} catch {
			// HeadObject throws if the object doesn't exist — proceed with upload
		}

		try {
			const body = await readFile(localPath);
			await client.send(
				new PutObjectCommand({
					Bucket: BUCKET,
					Key: r2Key,
					Body: body,
					ContentType: contentType
				})
			);
			console.log(`${label}  ✅ uploaded`);
		} catch (err) {
			console.log(`${label}  ❌ failed`);
			console.error(`   Error uploading ${filename}:`, err);
		}
	}
}

async function main(): Promise<void> {
	/** Root path to your local "photo mode" folder */
	const photoModeRoot = process.env.PHOTO_MODE_ROOT;
	if (!photoModeRoot) {
		console.error('❌ PHOTO_MODE_ROOT environment variable is not set.');
		process.exit(1);
	}

	const r2AccountId = process.env.R2_ACCOUNT_ID;
	const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
	const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

	if (!r2AccountId || !r2AccessKeyId || !r2SecretAccessKey) {
		console.error('❌ R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY must all be set.');
		process.exit(1);
	}

	/** Optional --game flag to upload a single game only */
	const gameArg = process.argv.indexOf('--game');
	const targetGame = gameArg !== -1 ? process.argv[gameArg + 1] : null;

	const client = new S3Client({
		region: 'auto',
		endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: r2AccessKeyId,
			secretAccessKey: r2SecretAccessKey
		}
	});

	if (targetGame) {
		// Upload a single game
		await uploadGameExports(client, photoModeRoot, targetGame);
	} else {
		// Upload all games
		const entries = await readdir(photoModeRoot, { withFileTypes: true });
		const gameFolders = entries.filter((e) => e.isDirectory()).map((e) => e.name);

		console.log(`Found ${gameFolders.length} game folder(s) in "${photoModeRoot}"`);

		for (const folder of gameFolders) {
			await uploadGameExports(client, photoModeRoot, folder);
		}
	}

	console.log('\n✅ Upload complete.');
}

main();
