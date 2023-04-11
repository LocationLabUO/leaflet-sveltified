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
	import { writable } from 'svelte/store';

	const parent = getContext<LayerContext>(layerCtx);

	export let events: (keyof DivOverlayEvents)[] = [];
	export let options: TooltipOptions = {};

	let tooltip = writable<Tooltip | undefined>();

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
		if (tooltip) {
			open = false;
		}
	}

	onMount(async () => {
		const L = await import('leaflet');
		$tooltip = L.tooltip(options);
		await tick();

		if ($parent?.getTooltip()) {
			$parent.off('tooltipopen');
			$parent.off('tooltipclose');
			$parent.unbindTooltip();
		}
		if ($parent) {
			$parent.on('tooltipopen', openTooltip);
			$parent.on('tooltipclose', closeTooltip);
			$parent.bindTooltip($tooltip);
		}
	});

	$: if (events) updateListeners();

	let listeners = new Set<keyof TooltipEvents>();
	const dispatch = createEventDispatcher();
	function updateListeners() {
		if (!$tooltip) return;
		const newEvents = new Set(events);
		for (const l of listeners) {
			if (newEvents.has(l)) newEvents.delete(l);
			else {
				$tooltip.off(l);
				listeners.delete(l);
			}
		}
		for (const e of newEvents) {
			if (!listeners.has(e)) {
				$tooltip.on(e, (ev) => dispatch(e, ev));
				listeners.add(e);
			}
		}
	}

	onDestroy(() => {
		if ($parent) {
			$parent.off('tooltipopen', openTooltip);
			$parent.off('tooltipclose', closeTooltip);
			$parent.unbindTooltip();
		}
		$tooltip = undefined;
	});
</script>

{#if open}
	<div bind:this={content}>
		<slot />
	</div>
{/if}
