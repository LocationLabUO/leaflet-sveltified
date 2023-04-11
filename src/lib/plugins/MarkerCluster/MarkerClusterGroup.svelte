<script lang="ts">
	import {
		featureGroupCtx,
		layerCtx,
		layerGroupCtx,
		mapCtx,
		markerClusterGroupCtx,
		type FeatureGroupContext,
		type LayerContext,
		type LayerGroupContext,
		type MapContext,
		type MarkerClusterGroupContext,
		type MarkerClusterGroupEvents
	} from '$lib';
	import type { MarkerClusterGroup, MarkerClusterGroupOptions } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount, setContext, tick } from 'svelte';

	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
	import { writable } from 'svelte/store';

	export let options: MarkerClusterGroupOptions = {};
	export let events: (keyof MarkerClusterGroupEvents)[] = [];

	const map = getContext<MapContext>(mapCtx);
	const parent = getContext<LayerGroupContext>(layerGroupCtx);

	let markerClusterGroup = writable<MarkerClusterGroup | undefined>();

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

		await tick();
		if ($parent) {
			console.log($parent);
			$markerClusterGroup.addTo($parent);
		} else if ($map) $markerClusterGroup.addTo($map);
	});

	onDestroy(async () => {
		if ($parent && $markerClusterGroup) $parent.removeLayer($markerClusterGroup);
		if ($map) $markerClusterGroup?.removeFrom($map);
		$markerClusterGroup = undefined;
	});

	function updateListeners() {}

	$: if (events) updateListeners();
</script>

<!-- <svelte:head>
	<script
		src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
		integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
		crossorigin=""
	></script></svelte:head -->

{#if $markerClusterGroup}
	<slot />
{/if}
