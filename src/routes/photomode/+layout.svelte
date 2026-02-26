<script lang="ts">
	import '../../photomode.css';

	import iconSvg from '$lib/assets/icon.svg';
	import iconPng from '$lib/assets/icon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={iconPng} sizes="64x64" />
	<link rel="icon" href={iconSvg} type="image/svg+xml" />
</svelte:head>

<header id="intro" class="container">
	<h1 class="corners"><span>Photo Mode</span></h1>
</header>

<main>
	{@render children()}
</main>

<footer class="container">
	<div>
		<p>
			Made with ❤️ and ☕ in Naarm by <a href="https://jono.gay">Jono</a>.
		</p>
		<p>
			All game assets depicted remain the property of their respective developers and publishers.
			Copyright is claimed solely over the original composition, framing, and post-processing edits.
		</p>
	</div>
</footer>
