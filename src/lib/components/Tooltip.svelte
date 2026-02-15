<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { Snippet } from 'svelte';

	const uid = $props.id();
	let isVisible = $state(false);

	const {
		content,
		children
	}: {
		content: string;
		children: Snippet;
	} = $props();

	/**
	 * Show tooltip
	 */
	const show = () => {
		isVisible = true;
	};

	/**
	 * Hide tooltip
	 */
	const hide = () => {
		isVisible = false;
	};

	/**
	 * Handle keyboard interactions
	 */
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && isVisible) {
			hide();
		}
	};
</script>

<div class="wrapper">
	<button
		class="trigger"
		aria-describedby={isVisible ? uid : undefined}
		onmouseenter={show}
		onmouseleave={hide}
		onfocus={show}
		onblur={hide}
		onkeydown={handleKeyDown}
	>
		{@render children()}
	</button>
	{#if isVisible}
		<div
			transition:fade={{ duration: 250, easing: cubicOut }}
			class="content"
			id={uid}
			role="tooltip"
		>
			{content}
		</div>
	{/if}
</div>

<style>
	.wrapper {
		display: contents;
		anchor-scope: --tooltip;
	}

	.trigger {
		all: unset;
		cursor: help;
		anchor-name: --tooltip;
	}

	.trigger:focus-visible {
		outline: 2px solid var(--link);
		outline-offset: 1px;
		border-radius: 4px;
	}

	.content {
		position: fixed;
		position-anchor: --tooltip;
		position-area: top span-all;
		position-try-fallbacks: flip-block flip-inline;

		margin-inline: 1em;

		background: rgb(0 0 0 / 0.75);
		backdrop-filter: blur(8px);
		color: white;
		padding: 0.2em 0.66em;
		border-radius: 4px;
		font-size: 0.75em;
		font-weight: 600;
		white-space: nowrap;
	}
</style>
