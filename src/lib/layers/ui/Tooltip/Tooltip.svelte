<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import { fade } from 'svelte/transition';
	import { setTooltipContext } from './Tooltip.svelte.js';

	/**
	 * @type {import('./Tooltip.d.ts').TooltipProps}
	 */
	let { open = $bindable(false), options, events, children } = $props();

	const parent = getParent();
	const context = setTooltipContext();
	const layerCtx = setLayerContext();

	let content = $state(undefined);

	$effect(() => {});
	//onMount
	$effect(async () => {
		const L = await import('leaflet');
		context.tooltip = L.tooltip(options);
		layerCtx.layer = context.tooltip;
		context.tooltip.on('add', () => {
			open = true;
		});
		context.tooltip.on('remove', () => {
			open = false;
		});

		parent.bindTooltip(context.tooltip);
	});

	$effect(() => {
		if (open) {
			if (!context.tooltip.isOpen()) {
				parent.openTooltip();
			}
			context.tooltip.setContent(content);
		} else {
			if (context.tooltip?.isOpen()) {
				parent.closeTooltip();
			}
		}
	});

	$effect(() => {
		return () => {
			context.tooltip.off('add');
			context.tooltip.off('remove');
			parent?.unbindTooltip();
		};
	});

	//events Effect
	$effect(() => {
		if (context.tooltip) {
			for (const key in events) {
				if (context.tooltip && events[key]) {
					context.tooltip.on(key, events[key]);
				}
			}
			return () => {
				for (const key in events) {
					context.tooltip?.off(key);
					//Re-add add and remove events
					if (key == 'add') {
						context.tooltip.on('add', () => {
							open = true;
						});
					}
					if (key == 'remove') {
						context.tooltip.on('remove', () => {
							open = false;
						});
					}
				}
			};
		}
	});
</script>

{#if open}
	<div bind:this={content} out:fade>
		{@render children?.()}
	</div>
{/if}
