<script lang="ts">
	import { onMount } from 'svelte';

	import type { GalleryImage, Game } from '$lib/types/gallery';

	import Image from '$lib/components/Image.svelte';
	import Thumb from '$lib/components/Thumb.svelte';

	const props = $props();
	let games: Game[] = $state(props.data.games);

	let currentImg: GalleryImage | null = $state(null);
	let currentGame: Game | null = $state(null);

	let modal: HTMLDialogElement;

	let loadingTimeout: ReturnType<typeof setTimeout> | null = null;

	let loadingID: string | null = $state(null);

	function loadModal(game: Game, pic: GalleryImage) {
		// Add loading graphic to link after a short delay
		currentImg = pic;
		currentGame = game;
		loadingTimeout = setTimeout(() => (loadingID = pic.id), 100);
	}

	function openModal() {
		modal.classList.add('is-opening');
		modal.showModal();

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				modal.classList.remove('is-opening');
				loadingID = null;
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
			<Thumb {pic} {game} isLoading={loadingID === pic.id} onclick={() => loadModal(game, pic)} />
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

		:global(.thumb) {
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
