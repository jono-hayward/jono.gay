<script lang="ts">
	import loading_anim from '$lib/assets/loading.svg?raw';
</script>

<div class="loader" aria-hidden="true">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html loading_anim}
</div>

<style>
	.loader {
		object-fit: contain;
		display: grid;
		place-items: center;
	}
	.loader :global(svg) {
		width: 90%;
		height: 90%;
		display: block;
	}
</style>
