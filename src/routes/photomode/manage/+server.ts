import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';

import type { GalleryData } from '$lib/types/gallery';
import { setGalleryData } from '$lib/server/gallery';

/** Saves the entire gallery dataset */
export const POST: RequestHandler = async ({ request, platform }) => {
	if (!platform) error(500, 'No Cloudflare platform context');

	const data: GalleryData = await request.json();
	await setGalleryData(platform, data);

	return json({ success: true });
};
