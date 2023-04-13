<script lang="ts">
	import {
		featureGroupCtx,
		layerCtx,
		layerGroupCtx,
		markerClusterGroupCtx,
		type FeatureGroupContext,
		type LayerContext,
		type LayerGroupContext,
		type MarkerClusterGroupContext,
		type MarkerClusterGroupEvents
	} from '$lib';
	import type { MarkerClusterGroup, MarkerClusterGroupOptions } from 'leaflet';
	import { createEventDispatcher, onDestroy, onMount, setContext, tick } from 'svelte';

	import { getParentStore, updateListeners } from '$lib/util/helpers';
	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
	import { writable } from 'svelte/store';

	export let options: MarkerClusterGroupOptions = {};
	export let events: (keyof MarkerClusterGroupEvents)[] = [];

	const listeners = new Set<keyof MarkerClusterGroupEvents>();

	const markerClusterGroup = writable<MarkerClusterGroup | undefined>();
	const parent = getParentStore();

	setContext<LayerContext>(layerCtx, markerClusterGroup);
	setContext<LayerGroupContext>(layerGroupCtx, markerClusterGroup);
	setContext<FeatureGroupContext>(featureGroupCtx, markerClusterGroup);
	setContext<MarkerClusterGroupContext>(markerClusterGroupCtx, markerClusterGroup);

	const dispatch = createEventDispatcher<MarkerClusterGroupEvents>();

	onMount(async () => {
		await import('leaflet');
		await import('leaflet.markercluster');
		const L = window['L']; //TODO: don't rely on global UMD
		$markerClusterGroup = L.markerClusterGroup(options);

		if (!$parent) await tick();
		if ($parent) $markerClusterGroup.addTo($parent);
	});

	onDestroy(async () => {
		if ($parent) $markerClusterGroup?.remove();
		$markerClusterGroup = undefined;
	});

	$: if (events && $markerClusterGroup)
		updateListeners($markerClusterGroup, events, listeners, dispatch);
</script>

{#if $markerClusterGroup}
	<slot />
{/if}
