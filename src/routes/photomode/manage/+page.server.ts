import type { PageServerLoad } from './$types';

import { listGames } from '$lib/server/r2';
import { getGalleryData } from '$lib/server/gallery';

export const load: PageServerLoad = async ({ platform }) => {
	if (!platform) throw new Error('No Cloudflare platform context available');

	const assets = await listGames();
	const { games } = await getGalleryData(platform);
	return { assets, games };
};
