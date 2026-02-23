<script lang="ts">
	import { resolve } from '$app/paths';
	import type { GalleryImage, Game } from '$lib/types/gallery';

	import { PUBLIC_ASSETS_URL } from '$env/static/public';

	import Image from '$lib/components/Image.svelte';

	const props = $props();
	// const PUBLIC_ASSETS_URL = props.data.publicAssetsUrl ?? '';
	let games: Game[] = $state(props.data.games);

	let currentImg: GalleryImage | null = $state(null);
	let currentGame: Game | null = $state(null);

	let modal: HTMLDialogElement;

	const openModal = (game: Game, pic: GalleryImage) => {
		currentImg = pic;
		currentGame = game;
		modal.showModal();
	};
</script>

<svelte:head>
	<title>Photo Mode 📸</title>
</svelte:head>

<main>
	<section id="intro" class="container">
		<h1 class="corners"><span>Photo Mode</span></h1>
	</section>

	{#each games as game (game.id)}
		<article id={game.id} class="game container">
			<h2>{game.title}</h2>
			{#each game.images.filter((img: GalleryImage) => img.display) as pic (pic.id)}
				<figure class="thumb corners" class:nsfw={pic.nsfw}>
					<a
						href={resolve(`/photomode/${game.id}/${pic.id}`)}
						onclick={(e) => {
							e.preventDefault();
							openModal(game, pic);
						}}
						><img
							alt={pic.alt}
							src={`${PUBLIC_ASSETS_URL}/${game.id}/${pic.id}-640w.webp`}
							loading="lazy"
						/></a
					>
				</figure>
			{/each}
		</article>
	{/each}

	<dialog
		bind:this={modal}
		onclick={(e) => {
			if (e.target === modal) modal.close();
		}}
	>
		{#if currentImg && currentGame}
			<Image src={`${currentGame.id}/${currentImg.id}`} alt={currentImg.alt} loading="eager" />
		{/if}
	</dialog>
</main>

<style>
	main {
		background: linear-gradient(to bottom right, #0c0b11, ease-in, #1a173e);
		color: white;
		width: 100dvw;
		min-height: 100dvh;
		position: relative;
		padding-block-start: 54px;
		display: flex;
		flex-direction: column;
		gap: 1px;

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA3IiBoZWlnaHQ9IjEwNyIgdmlld0JveD0iMCAwIDEwNyAxMDciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00MSA1M1Y1NEg1M1Y2Nkg1NFY1NEg2NlY1M0g1NFY0MUg1M1Y1M0g0MVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=');
			background-position: top center;
			opacity: 0.1;
			pointer-events: none;
			z-index: 0;
		}
	}

	dialog {
		margin: auto;
		padding: 0;
		border: none;
		box-shadow: 0 0 32px -8px black;
		&::backdrop {
			background: rgb(0 0 0 / 0.25);
			backdrop-filter: blur(4px);
		}
	}

	.thumb {
		margin: 0;
		position: relative;
		a {
			position: absolute;
			inset: -9px;
		}
		img {
			object-fit: cover;
			width: 100%;
			height: 100%;
		}

		&.nsfw a::after {
			content: 'NSFW';
			position: absolute;
			inset: 0;
			display: grid;
			place-items: center;
			background: rgba(0, 0, 0, 0.15);
			backdrop-filter: blur(12px);
			color: white;
			font-size: 14px;
			letter-spacing: 0.1em;
		}
	}

	.container {
		display: grid;
		width: min(100dvw, 1283px);
		margin-inline: auto;
		grid-template-columns: repeat(auto-fill, 106px);
		grid-auto-rows: 106px;
		gap: 1px;
		justify-content: center;
		z-index: 1;
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
			grid-column: span 4;
			grid-row: span 2;
		}
	}

	h1 {
		grid-column: 1 / -1;
		display: grid;
		place-items: center;

		span {
			--spacing: 0.64em;
			display: block;
			font-size: 46px;
			letter-spacing: var(--spacing);
			line-height: 1;
			text-align: center;
			margin-inline-end: calc(-1 * var(--spacing));
		}
		--aberration-offset: 0.04em;
		--aberration-bleed: 0.01em;
		--aberration-opacity: 0.4;
		text-shadow:
			calc(var(--aberration-offset) * 3) 0 var(--aberration-bleed)
				rgb(0 0 255 / var(--aberration-opacity)),
			calc(-1 * var(--aberration-offset)) var(--aberration-offset) var(--aberration-bleed)
				rgb(255 0 255 / var(--aberration-opacity)),
			calc(-1 * var(--aberration-offset) * 2) calc(-1 * var(--aberration-offset))
				var(--aberration-bleed) rgb(0 255 0 / var(--aberration-opacity)),
			calc(-1.5 * var(--aberration-offset)) calc(-0.5 * var(--aberration-offset))
				var(--aberration-bleed) rgb(255 255 255 / calc(var(--aberration-opacity) / 2)),
			calc(1.5 * var(--aberration-offset)) calc(0.5 * var(--aberration-offset))
				var(--aberration-bleed) rgb(255 255 255 / calc(var(--aberration-opacity) / 2));

		&::before,
		&::after {
			content: '';
			position: absolute;
			width: 25px;
			height: 13px;
			inset-block: auto;
		}

		&::before {
			bottom: calc(100% + 13px);
			background: url('/static/crosshair-half-top.svg') no-repeat center;
		}
		&::after {
			top: calc(100% + 13px);
			background: url('/static/crosshair-half-bottom.svg') no-repeat center;
		}
	}

	.corners {
		position: relative;

		border: 13px solid;
		border-image: url('/static/corner-frame.svg') 13;
		border-image-outset: 1px;
	}
</style>
