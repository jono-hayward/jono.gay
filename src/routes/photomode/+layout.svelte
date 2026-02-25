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
