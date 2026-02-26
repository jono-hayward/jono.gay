<!-- src/lib/components/Image.svelte -->
<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { GalleryImage, Game } from '$lib/types/gallery';

	interface Props {
		pic: GalleryImage;
		game: Game;
		/** Whether the image should be lazy loaded */
		loading?: 'lazy' | 'eager';
		/** Fetch priority hint — use 'high' for hero/LCP images */
		fetchpriority?: 'high' | 'low' | 'auto';
		class?: string;
		onload?: () => void;
	}

	let {
		pic,
		game,
		loading = 'lazy',
		fetchpriority = 'auto',
		class: className = '',
		onload
	}: Props = $props();

	let img: HTMLImageElement;

	$effect(() => {
		// If the image is already cached and loaded, call onload immediately
		if (img?.complete) {
			onload?.();
		}
	});

	const assetsUrl = env.PUBLIC_ASSETS_URL ?? 'https://assets.photomode.jono.gay';

	/** Breakpoints matching the sizes exported from GC12 */
	const BREAKPOINTS = [640, 960, 1440, 3440] as const;

	/**
	 * Builds a direct R2 URL for a given image, extension and width.
	 * e.g. https://assets.photomode.jono.gay/kingdom-come-deliverance-ii/2026-01-26-18-43-41-1440w.avif
	 */
	function buildUrl(extension: 'avif' | 'webp', width: number): string {
		return `${assetsUrl}/${game.id}/${pic.id}-${width}w.${extension}`;
	}

	/** Builds a srcset string across all breakpoints for a given format */
	function buildSrcset(extension: 'avif' | 'webp'): string {
		return BREAKPOINTS.map((w) => `${buildUrl(extension, w)} ${w}w`).join(', ');
	}

	const sizes = '100vw';

	const avifSrcset = $derived(buildSrcset('avif'));
	const webpSrcset = $derived(buildSrcset('webp'));

	/** Fallback src for browsers without <picture> support — 1440w WebP */
	const fallbackSrc = $derived(buildUrl('webp', 1440));
</script>

<picture style={game.aspectRatio ? `aspect-ratio: ${game.aspectRatio}` : undefined}>
	<!--
    HDR AVIF — only served to displays that support both wide-gamut (P3)
    and high dynamic range.
  -->
	{#if pic.hdr}
		<source
			type="image/avif"
			media="(color-gamut: p3) and (dynamic-range: high)"
			srcset={avifSrcset}
			{sizes}
		/>
	{/if}

	<!-- SDR WebP fallback for all other browsers -->
	<source type="image/webp" srcset={webpSrcset} {sizes} />

	<img
		src={fallbackSrc}
		alt={pic.alt}
		{loading}
		{fetchpriority}
		class={className}
		decoding="async"
		bind:this={img}
		{onload}
	/>
</picture>

<style>
	picture {
		display: block;
	}

	img {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
