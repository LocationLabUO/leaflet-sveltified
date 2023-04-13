<script lang="ts">
	import type { Tooltip, TooltipOptions } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount, setContext, tick } from 'svelte';

	import {
		layerCtx,
		tooltipCtx,
		type DivOverlayEvents,
		type LayerContext,
		type TooltipContext,
		type TooltipEvents
	} from '$lib';
	import { updateListeners } from '$lib/util/helpers';
	import { writable } from 'svelte/store';

	export let options: TooltipOptions = {};
	export let events: (keyof DivOverlayEvents)[] = [];
	const listeners = new Set<keyof TooltipEvents>();

	const parent = getContext<LayerContext>(layerCtx) || undefined;
	const tooltip = writable<Tooltip | undefined>();

	let open = false;
	let content: HTMLElement;

	setContext<LayerContext>(layerCtx, tooltip);
	setContext<TooltipContext>(tooltipCtx, tooltip);

	async function openTooltip() {
		open = true;
		await tick();
		$tooltip?.setContent(content);
	}
	async function closeTooltip() {
		if ($tooltip) {
			open = false;
		}
	}

	const dispatch = createEventDispatcher();

	onMount(async () => {
		const L = await import('leaflet');
		$tooltip = L.tooltip(options);

		await tick();

		if ($parent?.getTooltip()) {
			$parent.off('tooltipopen');
			$parent.off('tooltipclose');
			$parent.unbindTooltip();
		}

		$parent?.on('tooltipopen', openTooltip);
		$parent?.on('tooltipclose', closeTooltip);
		$parent?.bindTooltip($tooltip);
	});

	$: if (events && $tooltip) updateListeners($tooltip, events, listeners, dispatch);

	onDestroy(() => {
		if ($parent) $parent.unbindTooltip();
		$tooltip = undefined;
	});
</script>

{#if open}
	<div bind:this={content}>
		<slot />
	</div>
{/if}
