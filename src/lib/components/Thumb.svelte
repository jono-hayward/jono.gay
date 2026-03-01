<script lang="ts">
	import type { GalleryImage, Game } from '$lib/types/gallery';
	import { resolve } from '$app/paths';
	import { PUBLIC_ASSETS_URL } from '$env/static/public';

	import Loader from '$lib/components/Loader.svelte';

	interface Props {
		pic: GalleryImage;
		game: Game;
		onclick?: () => void;
		isLoading: boolean;
	}
	const { pic, game, onclick, isLoading }: Props = $props();

	async function handleClick(e: MouseEvent) {
		e.preventDefault();
		onclick?.();
	}
</script>

<figure class="thumb" class:nsfw={pic.nsfw}>
	<a href={resolve(`/photomode/${game.id}/${pic.id}`)} onclick={handleClick}
		><img
			alt={pic.alt}
			src={`${PUBLIC_ASSETS_URL}/${game.id}/${pic.id}-640w.webp`}
			loading="lazy"
		/>
		<div role="presentation" class="corners"></div>
	</a>
	{#if isLoading}<Loader />{/if}
</figure>

<style>
	.thumb {
		margin: 0;
		position: relative;
		opacity: 0.65;
		transition: opacity 350ms ease-in-out;
		&:has(a:hover),
		&:focus-within {
			opacity: 1;
		}
		a {
			position: absolute;
			inset: 4px;
		}
		img {
			object-fit: cover;
			width: 100%;
			height: 100%;
			filter: grayscale(1);
			transition: filter 350ms ease-in-out;
		}

		a:hover,
		a:focus-visible {
			img {
				filter: grayscale(0);
			}
		}

		&.nsfw a::before {
			content: 'NSFW';
			position: absolute;
			inset: 0;
			display: grid;
			place-items: center;
			background: rgba(0, 0, 0, 0.15);
			backdrop-filter: blur(12px);
			z-index: 10;

			font-family: var(--font-mono);
			font-size: 0.75em;
			font-weight: 900;
			letter-spacing: 75%;
			color: white;
		}

		.corners {
			pointer-events: none;
			position: absolute;
			inset: 0;
			/*opacity: 0;*/
			/*scale: 0.98;*/
			transition: inset 350ms ease-out;
			animation: flicker-out 150ms steps(1, end) forwards;
			filter: drop-shadow(0 0 4px white);
		}
		a:hover .corners {
			inset: -4px;
			opacity: 1;
			animation: none;
			animation: flicker-in 100ms steps(1, end) forwards;
		}
		:global(.loader) {
			position: absolute;
			inset: 4px;
			width: calc(100% - 8px);
			height: calc(100% - 8px);
			background: rgb(0 0 0 / 0.45);
		}
	}

	@keyframes flicker-in {
		0%,
		66.666% {
			opacity: 0;
		}
		33.333%,
		100% {
			opacity: 1;
		}
	}
	@keyframes flicker-out {
		0%,
		40%,
		80% {
			opacity: 1;
		}
		20%,
		60%,
		100% {
			opacity: 0;
		}
	}
</style>
