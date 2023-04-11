<script lang="ts">
	import type { Layer, Tooltip, TooltipOptions } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount, setContext, tick } from 'svelte';

	import {
		layerCtx,
		tooltipCtx,
		type DivOverlayEvents,
		type LayerContext,
		type TooltipContext
	} from '$lib';
	import EventBridge from '$lib/util/EventBridge';

	const { getLayer } = getContext<LayerContext>(layerCtx) || {};
	if (!getLayer) throw new Error('A tooltip must be nested within a Layer');

	export let events: (keyof DivOverlayEvents)[] = [];
	export let options: TooltipOptions = {};

	let tooltip: Tooltip;
	let parent: Layer;

	let open = false;
	let content: HTMLElement;

	setContext<LayerContext>(layerCtx, { getLayer: getTooltip });
	setContext<TooltipContext>(tooltipCtx, { getTooltip });

	async function openTooltip() {
		open = true;
		await tick();
		tooltip.setContent(content);
	}
	async function closeTooltip() {
		if (tooltip) {
			open = false;
		}
	}

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge<Tooltip>;

	onMount(async () => {
		const L = await import('leaflet');
		tooltip = L.tooltip(options);
		parent = await getLayer();

		if (parent.getTooltip()) {
			parent.off('tooltipopen');
			parent.off('tooltipclose');
			parent.unbindTooltip();
		}

		parent.on('tooltipopen', openTooltip);
		parent.on('tooltipclose', closeTooltip);
		parent.bindTooltip(tooltip);
		eventBridge = new EventBridge(tooltip, dispatch, events);

		console.log(tooltip.isOpen());
	});
	onDestroy(() => {
		if (parent) {
			parent.off('tooltipopen', openTooltip);
			parent.off('tooltipclose', closeTooltip);
			parent.unbindTooltip();
		}
		if (eventBridge) eventBridge.unregister();
	});

	export async function getTooltip() {
		await tick();
		return tooltip;
	}
</script>

{#if open}
	<div bind:this={content}>
		<slot />
	</div>
{/if}
