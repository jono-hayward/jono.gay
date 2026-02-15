<script lang="ts">
	import '../app.css';

	import iconSvg from '$lib/assets/icon.svg';
	import iconPng from '$lib/assets/icon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={iconPng} sizes="64x64" />
	<link rel="icon" href={iconSvg} type="image/svg+xml" />
</svelte:head>

{@render children()}
