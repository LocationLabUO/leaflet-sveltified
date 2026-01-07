<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { setupEvents } from '$lib/util/events.js';
	import { getParentContext } from '$lib/util/parent.js';
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import { setTooltipContext } from './Tooltip.svelte.js';

	/**
	 * @type {import('./Tooltip.d.ts').TooltipProps}
	 */
	let { open = $bindable(false), options, events, children } = $props();

	const { getParentValue } = getParentContext();
	const context = setTooltipContext();
	const layerCtx = setLayerContext();

	let content = $state(undefined);

	// Internal event handlers for syncing open state
	const onAdd = () => {
		open = true;
	};
	const onRemove = () => {
		open = false;
	};

	// Initialization effect - only depends on parent, not options
	// Options are read with untrack since they're only used at creation time
	$effect(() => {
		const parent = getParentValue();

		if (!parent) return;

		(async () => {
			const L = await import('leaflet');
			// Read options inside untrack to avoid re-running effect when options object reference changes
			const currentOptions = untrack(() => options);
			context.tooltip = L.tooltip(currentOptions);
			layerCtx.layer = context.tooltip;

			context.tooltip.on('add', onAdd);
			context.tooltip.on('remove', onRemove);

			parent.bindTooltip(context.tooltip);
		})();

		return () => {
			context.tooltip?.off('add', onAdd);
			context.tooltip?.off('remove', onRemove);
			parent?.unbindTooltip();
			context.tooltip = undefined;
		};
	});

	// Open/close state effect
	$effect(() => {
		const tooltip = context.tooltip;
		const parent = getParentValue();
		const currentContent = content;

		if (!tooltip || !parent) return;

		if (open) {
			if (!tooltip.isOpen()) {
				parent.openTooltip();
			}
			tooltip.setContent(currentContent);
		} else {
			if (tooltip.isOpen()) {
				parent.closeTooltip();
			}
		}
	});

	// User events effect
	$effect(() => {
		if (!context.tooltip) return;
		return setupEvents(context.tooltip, events);
	});
</script>

{#if open}
	<div bind:this={content} out:fade>
		{@render children?.()}
	</div>
{/if}
