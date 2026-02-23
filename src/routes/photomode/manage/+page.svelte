<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dragHandleZone, dragHandle } from 'svelte-dnd-action';
	import type { PageData } from './$types';
	import type { Game, GalleryImage, GalleryData } from '$lib/types/gallery';
	import { env } from '$env/dynamic/public';

	const { data }: { data: PageData } = $props();

	let games = $state(data.games);
	let loading = $state(false);

	const flipDurationMs = 300;

	const addGame = (e: Event) => {
		const menu = e.target as HTMLSelectElement;
		if (!menu?.value) return;
		const images = data.assets.find((asset) => asset.id === menu.value)?.images as GalleryImage[];

		const newGame: Game = {
			id: menu.value,
			title: '',
			description: '',
			images: images.map((img) => ({
				display: true,
				id: img.id,
				caption: '',
				alt: '',
				hdr: img.hdr,
				sdr: img.sdr,
				nsfw: false
			}))
		};
		games = [...games, newGame];

		menu.value = '';
	};

	const deleteGame = (id: string) => {
		games = games.filter((game) => game.id !== id);
	};

	const save = async () => {
		const body: GalleryData = { games };
		loading = true;
		await fetch('/photomode/manage', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		loading = false;
	};
</script>

<div class="editor">
	<section class="game-list">
		<h2>Games</h2>
		<ul
			use:dragHandleZone={{ items: games, flipDurationMs }}
			onconsider={(e) => (games = e.detail.items)}
			onfinalize={(e) => (games = e.detail.items)}
		>
			{#each games as game (game.id)}
				{@const gameId = game.id}

				<li class="game-tile" animate:flip={{ duration: flipDurationMs }}>
					<div class="grab-handle" use:dragHandle></div>
					<details>
						<summary>
							<span>{game.title}</span>
							<button class="destructive" onclick={() => deleteGame(game.id)}>Delete</button>
						</summary>

						<fieldset>
							<label>
								<span>Title</span>
								<input type="text" bind:value={game.title} />
							</label>
							<label>
								<span>Description</span>
								<textarea bind:value={game.description} rows={4}></textarea>
							</label>

							<ul
								class="images"
								use:dragHandleZone={{
									items: game.images,
									flipDurationMs,
									type: `images-${game.id}`,
									transformDraggedElement: (el) => {
										const img = el?.querySelector('img');
										if (img) {
											img.style.width = '300px';
											img.style.height = '200px';
											img.style.objectFit = 'cover';
										}
									}
								}}
								onconsider={(e) => {
									const idx = games.findIndex((g) => g.id === gameId);
									games[idx].images = e.detail.items;
								}}
								onfinalize={(e) => {
									const idx = games.findIndex((g) => g.id === gameId);
									games[idx].images = e.detail.items;
								}}
							>
								{#each game.images as pic (pic.id)}
									<li class="image-tile" animate:flip={{ duration: flipDurationMs }}>
										<div class="grab-handle" use:dragHandle></div>
										<img
											src={`${env.PUBLIC_ASSETS_URL}/${game.id}/${pic.id}-640w.webp`}
											alt={pic.id}
											loading="lazy"
										/>
										<fieldset>
											<label class="checkbox">
												<input type="checkbox" bind:checked={pic.display} />
												<span>Display</span>
											</label>
											<label>
												<span>Caption</span>
												<input type="text" bind:value={pic.caption} />
											</label>
											<label>
												<span>Alt text</span>
												<textarea bind:value={pic.alt} rows={2}></textarea>
											</label>
											<label class="checkbox">
												<input type="checkbox" bind:checked={pic.nsfw} />
												<span>Image contains NSFW content</span>
											</label>
										</fieldset>
									</li>
								{/each}
							</ul>
						</fieldset>
					</details>
				</li>
			{/each}
		</ul>
		<footer class="controls">
			<aside>
				<select onchange={addGame}>
					<option value="" disabled selected> Add game </option>
					{#each data.assets as game (game.id)}
						<option value={game.id}>{game.id.replace(/-/g, ' ')}</option>
					{/each}
				</select>
			</aside>
			<aside>
				{#if loading}
					<span>Saving...</span>
				{:else}
					<button class="primary" onclick={save}>Save</button>
				{/if}
			</aside>
		</footer>
	</section>
</div>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-flow: column;
		gap: 0.5em;
	}

	details {
		border: 1px solid #e1e2e3;
		width: 100%;
	}

	fieldset {
		display: flex;
		flex-flow: column;
		gap: 1em;
		border: 0;
	}

	label {
		display: flex;
		flex-flow: column;
		gap: 0.25em;
		&.checkbox {
			flex-flow: row;
			align-items: center;
		}
		> span {
			font-weight: bold;
			font-size: 0.8em;
			text-transform: uppercase;
			letter-spacing: normal;
			margin-inline-start: 0.25em;
		}

		input,
		textarea {
			padding: 0.5em;
			border: 1px solid #d1d2d3;
			border-radius: 8px;
		}
	}

	summary {
		cursor: pointer;
		padding: 0.5em 1em;

		background: #f1f2f3;
		text-transform: uppercase;
		letter-spacing: 5%;
	}
	details[open] summary {
		border-bottom: 1px solid #e1e2e3;
	}

	select {
		border-radius: 100vh;
		border: 1px solid oklch(80% 0.01 240);
		padding: 0.6em 1.2em;
		appearance: none;
	}

	button {
		padding: 0.6em 1.2em;
		border-radius: 100vh;
		cursor: pointer;
		font-weight: 700;
		text-transform: uppercase;
		font-size: 0.9em;

		&.primary {
			background: oklch(70% 0.6 240);
			border: 1px solid oklch(60% 0.5 240);
			color: white;
		}
		&.secondary {
			background: oklch(90% 0.01 240);
			border: 1px solid oklch(80% 0.01 240);
		}
		&.destructive {
			background: oklch(75% 0.35 20);
			border: 1px solid oklch(60% 0.3 20);
			color: white;
		}
	}

	.editor {
		display: flex;
		width: 100%;
		max-width: 900px;
		margin-inline: auto;
		height: 100dvh;
		padding: 1em;
		gap: 1em;

		h2 {
			margin-block: 0.5em;
		}
	}

	.game-list {
		flex: 1;
	}
	.game-tile {
		display: flex;
		gap: 0.5em;

		summary {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}

	.images {
		display: flex;
		flex-flow: column;
		gap: 0.5em;
		padding: 0.5em;
		border: 1px solid #e1e2e3;
		background: #f9f9f9;
		border-radius: 8px;
		position: relative;
		&:empty {
			height: 100px;
			&::after {
				content: 'Drop images here';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				color: #999;
				font-size: 0.9em;
			}
		}
	}

	.image-tile {
		display: flex;
		gap: 0.5em;
		img {
			width: 300px;
			height: auto;
			object-fit: cover;
		}
		fieldset {
			flex: 1;
			padding-block: 1em;
		}
	}

	.controls {
		display: flex;
		justify-content: space-between;
		margin-block-start: 1em;
		padding-inline: 1em;
	}

	.grab-handle {
		width: 20px;

		background: #ccc;
		border-radius: 4px;
		cursor: grab;
	}
</style>
