export interface Game {
	slug: string;
	title: string;
	description: string;
	images: ImageMetadata[];
}

export interface ImageMetadata {
	filename: string;
	alt: string;
	caption?: string;
	date?: string;
}
