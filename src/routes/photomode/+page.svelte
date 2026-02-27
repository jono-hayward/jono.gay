<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import type { GalleryImage, Game } from '$lib/types/gallery';

	import { PUBLIC_ASSETS_URL } from '$env/static/public';

	import Image from '$lib/components/Image.svelte';

	const props = $props();
	let games: Game[] = $state(props.data.games);

	let currentImg: GalleryImage | null = $state(null);
	let currentGame: Game | null = $state(null);

	let modal: HTMLDialogElement;

	let loadingTimeout: ReturnType<typeof setTimeout> | null = null;

	function loadModal(e: MouseEvent, game: Game, pic: GalleryImage) {
		e.preventDefault();
		loadingTimeout = setTimeout(() => {
			const target = e.target as HTMLElement;
			const link = target.closest('a');
			link?.classList.add('loading');
		}, 500);
		currentImg = pic;
		currentGame = game;
	}

	function openModal() {
		modal.classList.add('is-opening');
		modal.showModal();

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				modal.classList.remove('is-opening');
			});
		});

		if (loadingTimeout) {
			clearTimeout(loadingTimeout);
			loadingTimeout = null;
		}
		document.querySelectorAll('a.loading').forEach((el) => el.classList.remove('loading'));
	}

	function closeModal() {
		console.log('closing modal');
		modal.addEventListener(
			'transitionend',
			() => {
				modal.close();
				modal.classList.remove('is-closing');
				currentImg = null;
				currentGame = null;
			},
			{ once: true }
		);
		modal.classList.add('is-closing');
	}

	onMount(() => {
		modal.addEventListener('cancel', (e: Event) => {
			e.preventDefault();
			closeModal();
		});
	});
</script>

<svelte:head>
	<title>Photo Mode 📸</title>
</svelte:head>

{#each games as game (game.id)}
	<article id={game.id} class="game container">
		<h2>{game.title}</h2>
		{#each game.images.filter((img: GalleryImage) => img.display) as pic (pic.id)}
			<figure class="thumb" class:nsfw={pic.nsfw}>
				<a
					href={resolve(`/photomode/${game.id}/${pic.id}`)}
					onclick={(e) => {
						loadModal(e, game, pic);
					}}
					><img
						alt={pic.alt}
						src={`${PUBLIC_ASSETS_URL}/${game.id}/${pic.id}-640w.webp`}
						loading="lazy"
					/>
					<div role="presentation" class="corners"></div>
				</a>
			</figure>
		{/each}
	</article>
{/each}

<dialog
	bind:this={modal}
	onclick={(e) => {
		if (e.target === modal) closeModal();
	}}
>
	{#if currentImg && currentGame}
		{#key currentImg.id}
			<figure>
				<Image game={currentGame} pic={currentImg} onload={openModal} loading="eager" />
				{#if currentImg.caption}<figcaption>{currentImg.caption}</figcaption>{/if}
			</figure>
		{/key}
	{/if}
</dialog>

<style>
	dialog {
		margin: auto;
		max-width: 90vw;
		max-height: 90vh;
		padding: 0;
		border: none;
		box-shadow: 0 0 32px -8px black;
		background: transparent;

		/* Closed/closing state defaults */
		--dialog-opacity: 0;
		--dialog-scale: 0.98;
		--backdrop-color: transparent;
		--backdrop-blur: blur(0px);
		--dur: 0.5s;

		opacity: var(--dialog-opacity);
		transform: scale(var(--dialog-scale));

		transition:
			opacity var(--dur) linear,
			transform var(--dur) ease-out,
			overlay var(--dur) ease-out,
			display var(--dur) ease-out;
		transition-behavior: allow-discrete;

		&::backdrop {
			will-change: backdrop-filter, background-color;

			background-color: var(--backdrop-color);
			backdrop-filter: var(--backdrop-blur);

			transition:
				background-color var(--dur) ease-out,
				backdrop-filter var(--dur) ease-out;
		}

		&[open]:not(:global(.is-closing)):not(:global(.is-opening)) {
			--dialog-opacity: 1;
			--dialog-scale: 1;
			--backdrop-color: rgb(0 0 0 / 0.45);
			--backdrop-blur: blur(12px);
			--delay: 0ms;
		}
	}

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

		a:global(.loading)::after {
			content: 'loading (TODO: animate this)';
			position: absolute;
			inset: 0;
			z-index: 20;
			background: rgb(0 0 0 / 0.25);
			display: grid;
			place-items: center;
			color: white;
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

	.game {
		margin-top: 107px;
		h2 {
			grid-column: 1 / -1;
			font-size: 20px;
			letter-spacing: 40%;
			text-shadow: 0 0 4px rgb(255 255 255 / 0.45);
			display: grid;
			align-items: center;
		}

		figure {
			grid-column: span 1;
			grid-row: span 2;
		}
	}

	figure {
		display: flex;
		flex-flow: column;
	}

	figcaption {
		background: rgb(0 0 0 / 0.65);
		padding: 1em;
		color: white;
		font-weight: 600;
	}
</style>
