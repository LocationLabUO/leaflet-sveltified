<script lang="ts">
	import {
		layerCtx,
		layerGroupCtx,
		type LayerContext,
		type LayerGroupContext,
		type LayerGroupEvents
	} from '$lib';
	import type { LayerGroup, LayerOptions } from 'leaflet';
	import { createEventDispatcher, onDestroy, onMount, setContext, tick } from 'svelte';

	import { getParentStore, updateListeners } from '$lib/util/helpers';
	import { writable } from 'svelte/store';

	export let options: LayerOptions = {};
	export let events: (keyof LayerGroupEvents)[] = [];
	export let zIndex = 1;

	const listeners = new Set<keyof LayerGroupEvents>();

	let layerGroup = writable<LayerGroup | undefined>();
	const parent = getParentStore();

	setContext<LayerContext>(layerCtx, layerGroup);
	setContext<LayerGroupContext>(layerGroupCtx, layerGroup);

	const dispatch = createEventDispatcher<LayerGroupEvents>();

	onMount(async () => {
		const L = await import('leaflet');
		$layerGroup = L.layerGroup([], options);

		if (!$parent) await tick();
		if ($parent) $layerGroup.addTo($parent);
	});

	onDestroy(async () => {
		if ($parent) $layerGroup?.remove();
		$layerGroup = undefined;
	});

	$: if (events && $layerGroup) updateListeners($layerGroup, events, listeners, dispatch);
	$: $layerGroup?.setZIndex(zIndex);
</script>

{#if $layerGroup}
	<slot />
{/if}
