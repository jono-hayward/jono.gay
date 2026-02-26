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
		// modal.showModal();
	};
	const unloadModal = () => {
		modal.addEventListener(
			'transitionend',
			() => {
				currentImg = null;
				currentGame = null;
			},
			{ once: true }
		);
	};
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
						e.preventDefault();
						openModal(game, pic);
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
		if (e.target === modal) modal.close();
	}}
	onclose={unloadModal}
>
	{#if currentImg && currentGame}
		{#key currentImg.id}
			<figure>
				<Image
					game={currentGame}
					pic={currentImg}
					loading="eager"
					onload={() => modal?.showModal()}
				/>
				{#if currentImg.caption}<figcaption>{currentImg.caption}</figcaption>{/if}
			</figure>
		{/key}
	{/if}
</dialog>

<style>
	dialog {
		margin: auto;
		padding: 0;
		border: none;
		box-shadow: 0 0 32px -8px black;
		max-width: 90vw;
		max-height: 90vh;
		background: transparent;

		transition-property: opacity, overlay, transform, display;
		transition-duration: 450ms;
		transition-timing-function: ease-out;
		transition-behavior: allow-discrete;

		opacity: 0;
		transform: scale(0.95);

		&::backdrop {
			opacity: 0;
			background: rgb(0 0 0 / 0.45);

			transition-property: opacity, overlay, display, backdrop-filter;
			transition-duration: 450ms;
			transition-timing-function: ease-out;
			transition-behavior: allow-discrete;
		}

		&[open] {
			opacity: 1;
			transform: scale(1);

			@starting-style {
				opacity: 0;
				transform: scale(0.95);
			}

			&::backdrop {
				opacity: 1;
				backdrop-filter: blur(8px);
				@starting-style {
					opacity: 0;
				}
			}
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

		&.nsfw a::after {
			content: 'NSFW';
			position: absolute;
			inset: 0;
			display: grid;
			place-items: center;
			background: rgba(0, 0, 0, 0.15);
			backdrop-filter: blur(12px);

			font-family: var(--font-mono);
			font-size: 0.75em;
			font-weight: 900;
			letter-spacing: 75%;
			color: white;
		}

		.corners {
			position: absolute;
			inset: -4px;
			/*opacity: 0;*/
			scale: 0.98;
			transition: scale 350ms ease-out;
			animation: flicker-out 0.45s steps(1, end) forwards;
		}
		a:hover .corners {
			scale: 1;
			opacity: 1;
			animation: none;
		}
	}

	@keyframes flicker-out {
		0% {
			opacity: 1;
		} /* Fully visible */
		25% {
			opacity: 0;
		} /* Frame 2 — snap off */
		40% {
			opacity: 0.75;
		} /* Frame 3 — snap back */
		55% {
			opacity: 0;
		} /* Frame 4 — snap off again */
		70% {
			opacity: 0.5;
		} /* Brief ghost reappearance */
		100% {
			opacity: 0;
		} /* Gone */
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
