/** A single photo mode image */
export interface GalleryImage {
	display: boolean;
	id: string;
	caption: string;
	alt: string;
	hdr: boolean;
	sdr: boolean;
	nsfw: boolean;
}

/** A game with its associated gallery images */
export interface Game {
	id: string;
	title: string;
	description: string;
	images: GalleryImage[];
}

/** Root data structure stored in KV */
export interface GalleryData {
	games: Game[];
}
