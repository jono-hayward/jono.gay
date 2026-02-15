<script lang="ts">
	import badgeMask from '$lib/assets/badge-mask.svg?no-inline';

	interface Props {
		src: string;
		alt: string;
	}

	const { src = '', alt = '' }: Props = $props();
</script>

<div class="portrait-wrapper">
	<figure class="portrait">
		<img {src} {alt} />
		<img {src} alt="" role="presentation" aria-hidden="true" />
		<div class="pronouns" aria-hidden="true">
			<div class="badge" style="--mask-url: url('{badgeMask}')">
				he
				<hr />
				him
			</div>
		</div>
	</figure>
</div>

<style>
	@property --glow-angle {
		syntax: '<angle>';
		inherits: true;
		initial-value: -90deg;
	}
	:root {
		--portrait-padding: 0.5rem;
		--rainbow:
			#ffffff, #ffafc8, #74d7ee, #613915, #e40303, #ff8c00, #ffed00, #008026, #004dff, #750787,
			#ffffff;

		--radius-base: 42vmin;
		--radius: 0 0 0 var(--radius-base);
		--radius-padding: 0 0 0 calc(var(--radius-base) + var(--portrait-padding));
	}

	figure {
		padding: 0;
		margin: 0;
	}

	.portrait-wrapper {
		position: absolute;
		top: -0.6rem;
		right: -1rem;
	}

	.portrait {
		width: 90vw;
		aspect-ratio: 1 / 1.1;
		padding: var(--portrait-padding);
		border: 2px solid transparent;
		isolation: isolate;

		animation: glow-rotate 20s linear infinite;

		background:
			padding-box linear-gradient(var(--bg), var(--bg)),
			border-box conic-gradient(from var(--glow-angle), var(--rainbow));
		border-radius: var(--radius-padding);

		&:hover img[role='presentation'] {
			opacity: 1;
		}
	}

	.portrait img {
		position: absolute;
		inset: var(--portrait-padding);

		width: calc(100% - var(--portrait-padding) * 2);
		height: calc(100% - var(--portrait-padding) * 2);
		object-fit: cover;
		object-position: center 10%;
		mix-blend-mode: luminosity;
		border-radius: var(--radius);
	}

	.portrait img[role='presentation'] {
		pointer-events: none;
		mix-blend-mode: normal;
		opacity: 0;
		transition: opacity 350ms ease-in-out;
	}

	.portrait::before,
	.portrait::after {
		content: '';
		position: absolute;
		pointer-events: none;
		border-radius: var(--radius-padding);
	}

	.portrait::before {
		inset: 2px;
		z-index: 0;
		background: radial-gradient(var(--bg), transparent);
		border: var(--portrait-padding) solid var(--bg);
	}

	.portrait::after {
		inset: 0;
		z-index: -2;
		background: conic-gradient(from var(--glow-angle) at 50% 50%, var(--rainbow));
		opacity: 0.65;
		filter: blur(4rem);
	}

	.pronouns {
		position: absolute;
		line-height: 1;
		bottom: 5%;
		left: 0;
		z-index: 2;
		transform: rotate(-22deg);
		filter: drop-shadow(2px 2px 4px rgb(0 0 0 / 0.25));

		.badge {
			display: flex;
			flex-flow: column;
			align-items: center;
			justify-content: center;
			place-items: center;
			aspect-ratio: 1;
			width: 5rem;

			background: #ffed00;
			color: #613915;
			text-transform: uppercase;
			font-weight: 900;
			text-align: center;
			font-size: 1.2rem;

			mask: var(--mask-url) no-repeat center / contain;
		}

		hr {
			border: none;
			border-top: 2px solid currentColor;
			width: 60%;
			margin: 0.25rem auto;
		}
	}

	@media (max-width: 900px) and (orientation: landscape) {
		.portrait {
			width: 50vw;
			.pronouns {
				bottom: 40%;
				left: -10%;
				transform: rotate(30deg);
			}
		}
	}

	@media (min-width: 900px) {
		:root {
			--radius: 5rem;
			--radius-padding: calc(var(--radius) + var(--portrait-padding));
		}

		.portrait-wrapper {
			inset: auto;
			flex: 1 1 40%;
			position: relative;
		}

		.portrait {
			position: sticky;
			top: 5vh;
			max-height: 90vh;
			width: auto;
			aspect-ratio: 4 / 6;

			&::before {
				inset: 0;
			}
		}
		.portrait img {
			inset: var(--portrait-padding);
		}
		.pronouns {
			bottom: auto;
			top: -1.5rem;
			left: -1.5rem;
		}

		@supports (corner-shape: squircle) {
			:root {
				--radius: 8rem;
			}

			.portrait,
			.portrait::before,
			.portrait-wrapper::before,
			.portrait-wrapper::after,
			.portrait img {
				corner-shape: squircle;
			}
		}
	}

	@keyframes glow-rotate {
		to {
			--glow-angle: 270deg;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.portrait {
			animation: none;
		}
	}
	/**
 * Unfortunate hack to disable the animation in Safari,
 * which really doesn't like the animation combined with the blurring
 */
	@supports (font: -apple-system-body) {
		.portrait {
			animation: none;
		}
	}
</style>
