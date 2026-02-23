import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';

import { listGames } from '$lib/server/r2';
import { getGalleryData } from '$lib/server/gallery';

export const load: PageServerLoad = async ({ platform }) => {
	if (!dev) error(404);
	if (!platform) throw new Error('No Cloudflare platform context available');

	const assets = await listGames();
	const { games } = await getGalleryData(platform);
	return { assets, games };
};
