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
	import EventBridge from '$lib/util/EventBridge';
	import type { MarkerClusterGroup, MarkerClusterGroupOptions } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount, setContext, tick } from 'svelte';

	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

	export let options: MarkerClusterGroupOptions = {};
	export let events: (keyof MarkerClusterGroupEvents)[] = [];

	const { getMap } = getContext<MapContext>(mapCtx) || {};
	if (!getMap) throw Error('MarkerClusterGroup should be nested inside a LeafletMap');
	const { getLayerGroup } = getContext<LayerGroupContext>(layerGroupCtx) || {};

	let markerClusterGroup: MarkerClusterGroup;

	export async function getMarkerClusterGroup() {
		if (!markerClusterGroup) await tick();
		return markerClusterGroup;
	}
	setContext<LayerContext>(layerCtx, {
		getLayer: getMarkerClusterGroup
	});
	setContext<LayerGroupContext>(layerGroupCtx, {
		getLayerGroup: getMarkerClusterGroup
	});
	setContext<FeatureGroupContext>(featureGroupCtx, {
		getFeatureGroup: getMarkerClusterGroup
	});
	setContext<MarkerClusterGroupContext>(markerClusterGroupCtx, { getMarkerClusterGroup });

	let eventBridge: EventBridge<MarkerClusterGroup>;
	const dispatch = createEventDispatcher<MarkerClusterGroupEvents>();

	onMount(async () => {
		// await import('leaflet');
		await import('leaflet.markercluster');
		const L = window['L']; //TODO: don't rely on global UMD
		markerClusterGroup = L.markerClusterGroup(options);

		markerClusterGroup.addTo(getLayerGroup ? await getLayerGroup() : await getMap());
		eventBridge = new EventBridge(markerClusterGroup, dispatch, events);
	});

	onDestroy(async () => {
		const s = performance.now();
		const map = await getMap();
		const t = performance.now();
		console.log(`p: ${t - s}`);
		if (!map) return;
		console.log(map);

		if (eventBridge) eventBridge.unregister();
		if (map) markerClusterGroup.removeFrom(map);
		// if (markerClusterGroup) markerClusterGroup.removeFrom(await getMap());
		console.log('destroyed');
	});
</script>

<!-- <svelte:head>
	<script
		src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
		integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
		crossorigin=""
	></script></svelte:head -->
>

{#if markerClusterGroup}
	<slot />
{/if}
