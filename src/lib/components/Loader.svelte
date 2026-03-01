<script lang="ts">
	import loading_vid from '$lib/assets/loading-anim.webm';
</script>

<video class="loader" loop autoplay muted playsinline>
	<source src={loading_vid} />
</video>

<style>
	video {
		object-fit: contain;
	}
</style>
