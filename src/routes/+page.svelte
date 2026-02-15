<script>
	import me from '$lib/assets/me.webp';

	import Portrait from '$lib/components/Portrait.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
</script>

<svelte:head>
	<title>Hi. I'm Jono 🧔🏻‍♂️</title>

	<meta property="og:title" content="Hi. I'm Jono 🧔🏻‍♂️" />
	<meta
		property="og:description"
		content="I'm a queer nerd, Trekkie and front-end web dev from Naarm 🇦🇺"
	/>
</svelte:head>

<main>
	<section class="body" id="about">
		<div class="content">
			<h1>
				<small>Hi. I'm</small>
				<span
					>Jono<br />
					Hayward</span
				>
				<span class="sr-only">(he/him)</span>
			</h1>

			<p>
				I'm a queer nerd living in
				<Tooltip content="Melbourne, Australia">
					<abbr title="Melbourne, Australia" lang="en-AU-x-indigenous">Naarm</abbr>
				</Tooltip>, also:
			</p>
			<ul>
				<li>
					<span class="emoji" aria-hidden="true">🧠</span>
					<span>
						<Tooltip content="Autism/Attention Deficit Hyperactivity Disorder">
							<abbr title="Autism/Attention Deficit Hyperactivity Disorder">AuDHD</abbr>
						</Tooltip>
						<Tooltip content="as fuck">
							<abbr title="as fuck">AF</abbr>
						</Tooltip>
					</span>
				</li>
				<li>
					<span class="emoji" aria-hidden="true">🐈‍⬛</span>
					<span>cat dad</span>
				</li>
				<li>
					<span class="emoji" aria-hidden="true">🖖🏻</span>
					<span>Trekkie</span>
				</li>
				<li>
					<span class="emoji" aria-hidden="true">🧔🏻‍♂️</span>
					<span>beard appreciator</span>
				</li>
				<li>
					<span class="emoji" aria-hidden="true">🥃</span>
					<span>whiskey drinker</span>
				</li>
				<li>
					<span class="emoji" aria-hidden="true">✍🏻</span>
					<span>word game enjoyer</span>
				</li>
				<li>
					<span class="emoji" aria-hidden="true">🕺🏻</span>
					<span>terrible dancer</span>
				</li>
				<li>
					<span class="emoji" aria-hidden="true">📱</span>
					<span>buyer of too many gadgets</span>
				</li>
				<li>
					<span class="emoji" aria-hidden="true">🕹️</span>
					<span>video game button masher</span>
				</li>
			</ul>
			<p>I work in the Victorian public sector, where I'm a:</p>
			<ul>
				<li>
					<span class="emoji" aria-hidden="true">🎨</span>
					<span>
						<Tooltip content="User experience/User interface">
							<abbr title="User experience/User interface">UX/UI</abbr>
						</Tooltip> designer</span
					>
				</li>
				<li>
					<span class="emoji" aria-hidden="true">🦮</span>
					<span>
						<Tooltip content="accessibility">
							<abbr title="accessibility">a11y</abbr>
						</Tooltip> advocate</span
					>
				</li>
				<li>
					<span class="emoji" aria-hidden="true">👨🏻‍💻</span>
					<span>front-end web dev</span>
				</li>
			</ul>
			<p>I'm passionate about:</p>
			<ul>
				<li>
					<span class="emoji" aria-hidden="true">🏳️‍🌈</span>
					<span>
						<Tooltip
							content="Lesbian, gay, bisexual, transgender, queer, intersex, asexual/aromantic"
						>
							<abbr title="Lesbian, gay, bisexual, transgender, queer, intersex, asexual/aromantic"
								>LGBTQIA+</abbr
							>
						</Tooltip>
						rights
					</span>
				</li>
				<li>
					<span class="emoji" aria-hidden="true">🧠</span>
					<span>mental health</span>
				</li>
				<li>
					<span class="emoji" aria-hidden="true">🚀</span>
					<span>did I mention I like Star Trek?</span>
				</li>
			</ul>
			<p>
				Find me on
				<a data-text="Bluesky" rel="noopener" href="https://bsky.app/profile/jono.gay">Bluesky</a>,
				<a data-text="Github" rel="noopener" href="https://github.com/jono-hayward">Github</a>,
				<a data-text="Letterboxd" rel="noopener" href="https://letterboxd.com/ohnojono/"
					>Letterboxd</a
				>, or if you truly must&hellip;
				<a data-text="LinkedIn" rel="noopener" href="https://www.linkedin.com/in/jonohayward/"
					>LinkedIn</a
				>.
			</p>
		</div>

		<Portrait
			src={me}
			alt="Portrait of me, Jono. I'm sitting at a table in a white shirt with a floral pattern, resting my chin on my left hand. I've got a beard and slicked-back brown hair with a grey streak on the front-left. I'm wearing Ray-Ban clubmaster style sunglasses, an Apple Watch Ultra with a metal and leather band on one wrist, and a thin leather strap wrapped around the other wrist."
		/>
	</section>
	<section class="acknowledgement-of-country" id="aoc">
		<h2 class="sr-only">Acknowledgement of Country</h2>
		<p>
			I live and work on the lands of the Wurundjeri and Bunurong Peoples of the Kulin Nation. I
			respectfully acknowledge the Traditional Owners of these lands, and pay respect to them, their
			culture and their Elders past, present and emerging.
		</p>
		<p>
			Sovereignty of this land was never ceded.
			<strong>It always was and always will be Aboriginal land.</strong>
		</p>
	</section>

	<section id="things">
		<h2>Things I've built</h2>
		<p>coming soon&hellip;</p>
	</section>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 6rem;
		margin-top: 15vh;
	}
	section {
		max-width: var(--content-width);
	}
	#about .content {
		p {
			margin: 1.5em 0 0.5em;
		}
	}

	#aoc {
		padding-block: 3rem;
		border-top: 2px solid var(--accent);
		color: var(--aoc-text);
		background: linear-gradient(to bottom, oklch(from var(--bg) l c h / 0.15), transparent);
		position: relative;
		&::before,
		&::after {
			content: '';
			position: absolute;
			inset-block: -2px;
			background: inherit;
			border: inherit;
			width: calc((100vw - var(--content-width)) / 2);
		}
		&::before {
			right: 100%;
		}
		&::after {
			left: 100%;
		}
	}

	@media (width >= 900px) {
		.body {
			position: relative;
			overflow: unset;

			display: flex;
			gap: 2rem;
		}

		#about h1 {
			margin: 0 0 5vh;
		}

		#aoc {
			display: flex;
			flex-direction: row;
			align-items: start;
			gap: 4rem;
		}
		#about {
			display: flex;
			gap: 2rem;
			flex-direction: row;

			.content {
				flex: 1 1 60%;
			}
		}
	}

	@media (max-width: 900px) and (orientation: landscape) {
		section {
			padding-inline-start: calc(2rem + env(safe-area-inset-left));
			padding-inline-end: calc(2rem + env(safe-area-inset-right));
		}

		h1 {
			margin: 0 0 50vh;
		}
	}
</style>
