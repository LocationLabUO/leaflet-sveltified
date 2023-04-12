<script lang="ts">
	import {
		layerCtx,
		layerGroupCtx,
		mapCtx,
		type LayerContext,
		type LayerGroupContext,
		type LayerGroupEvents,
		type MapContext
	} from '$lib';
	import type { LayerGroup, LayerOptions } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount, setContext, tick } from 'svelte';

	import { updateListeners } from '$lib/util/helpers';
	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
	import { writable } from 'svelte/store';

	export let options: LayerOptions = {};
	export let events: (keyof LayerGroupEvents)[] = [];

	const map = getContext<MapContext>(mapCtx) || undefined;
	if (!map) throw Error('LayerGroup must be nested under a LeafletMap or LayerGroup');
	const layergroup = getContext<LayerGroupContext | undefined>(layerGroupCtx);

	const parent = layergroup ?? map;

	let layerGroup = writable<LayerGroup | undefined>();

	setContext<LayerContext>(layerCtx, layerGroup);
	setContext<LayerGroupContext>(layerGroupCtx, layerGroup);

	const dispatch = createEventDispatcher<LayerGroupEvents>();

	onMount(async () => {
		await import('leaflet');
		const L = window['L']; //TODO: don't rely on global UMD
		$layerGroup = L.layerGroup([], options);

		if (!$parent) await tick();
		if ($parent) {
			$layerGroup.addTo($parent);
		}
	});

	onDestroy(async () => {
		console.log($parent);
		if ($parent && $layerGroup) $layerGroup.remove();
		$layerGroup = undefined;
	});

	const listeners = new Set<keyof LayerGroupEvents>();

	$: if (events && $layerGroup) updateListeners($layerGroup, events, listeners, dispatch);
</script>

{#if $layerGroup}
	<slot />
{/if}
