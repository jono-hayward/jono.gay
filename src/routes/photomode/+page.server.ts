import type { PageServerLoad } from './$types';

import { getGalleryData } from '$lib/server/gallery';

export const load: PageServerLoad = async ({ platform }) => {
	if (!platform) throw new Error('No Cloudflare platform context available');

	const { games } = await getGalleryData(platform);
	return { games };
};
