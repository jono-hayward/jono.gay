<!-- src/lib/components/CloudflareImage.svelte -->
<script lang="ts">
	import { env } from '$env/dynamic/public';

	interface Props {
		/** Path to the image in R2, without extension or width suffix e.g. 'photos/sunset' */
		src: string;
		/** Alt text — required for accessibility */
		alt: string;
		/** Additional CSS classes applied to the <img> element */
		class?: string;
		/** Whether the image should be lazy loaded */
		loading?: 'lazy' | 'eager';
		/** Fetch priority hint — use 'high' for hero/LCP images */
		fetchpriority?: 'high' | 'low' | 'auto';
		/**
		 * Optional aspect ratio to reserve space before image loads, preventing reflow.
		 * Format: 'width/height' e.g. '16/9' or '21/9'
		 */
		aspectRatio?: string;
	}

	let {
		src,
		alt,
		class: className,
		loading = 'lazy',
		fetchpriority = 'auto',
		aspectRatio
	}: Props = $props();

	const assetsUrl = env.PUBLIC_ASSETS_URL ?? 'https://assets.photomode.jono.gay';

	/** Breakpoints matching the sizes exported from GC12 */
	const BREAKPOINTS = [640, 960, 1280, 1440] as const;

	/**
	 * Builds a direct R2 URL for a given image, extension and width.
	 * e.g. https://assets.photomode.jono.gay/photos/sunset-1440w.avif
	 */
	function buildUrl(imageSrc: string, extension: 'avif' | 'webp', width: number): string {
		const cleanSrc = imageSrc.replace(/^\//, '');
		return `${assetsUrl}/${cleanSrc}-${width}w.${extension}`;
	}

	/** Builds a srcset string across all breakpoints for a given format */
	function buildSrcset(imageSrc: string, extension: 'avif' | 'webp'): string {
		return BREAKPOINTS.map((w) => `${buildUrl(imageSrc, extension, w)} ${w}w`).join(', ');
	}

	const sizes = [
		'(max-width: 640px) 640px',
		'(max-width: 960px) 960px',
		'(max-width: 1280px) 1280px',
		'1440px'
	].join(', ');

	const avifSrcset = $derived(buildSrcset(src, 'avif'));
	const webpSrcset = $derived(buildSrcset(src, 'webp'));

	/** Fallback src for browsers without <picture> support — 1280w WebP */
	const fallbackSrc = $derived(buildUrl(src, 'webp', 1280));
</script>

<picture style={aspectRatio ? `aspect-ratio: ${aspectRatio}` : undefined}>
	<!--
    HDR AVIF — only served to displays that support both wide-gamut (P3)
    and high dynamic range.
  -->
	<source
		type="image/avif"
		media="(color-gamut: p3) and (dynamic-range: high)"
		srcset={avifSrcset}
		{sizes}
	/>

	<!-- SDR WebP fallback for all other browsers -->
	<source type="image/webp" srcset={webpSrcset} {sizes} />

	<img src={fallbackSrc} {alt} {loading} {fetchpriority} class={className} decoding="async" />
</picture>
