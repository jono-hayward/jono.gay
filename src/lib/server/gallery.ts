// src/lib/server/gallery.ts
import type { GalleryData } from '$lib/types/gallery';

const KV_KEY = 'games';

/** Fetches all gallery data from Cloudflare KV */
export async function getGalleryData(platform: App.Platform): Promise<GalleryData> {
	const data = await platform.env.PHOTOMODE_KV.get<GalleryData>(KV_KEY, { type: 'json' });
	return data ?? { games: [] };
}

/** Writes the full gallery data to KV */
export async function setGalleryData(platform: App.Platform, data: GalleryData): Promise<void> {
	await platform.env.PHOTOMODE_KV.put(KV_KEY, JSON.stringify(data));
}
