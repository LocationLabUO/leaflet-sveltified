<script lang="ts">
	import type { LatLngExpression, Marker, MarkerOptions } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount, setContext, tick } from 'svelte';

	import {
		layerCtx,
		layerGroupCtx,
		mapCtx,
		markerCtx,
		type LayerContext,
		type LayerGroupContext,
		type MapContext,
		type MarkerContext,
		type MarkerEvents
	} from '$lib';
	import EventBridge from '../../util/EventBridge';

	export let latLng: LatLngExpression;
	export let zIndexOffset = 0;
	export let opacity = 1.0;
	export let options: MarkerOptions | undefined = {};
	export let events: (keyof MarkerEvents)[] = [];

	const { getMap } = getContext<MapContext>(mapCtx) || {};
	if (!getMap) throw Error('Marker must be nested within a LeafletMap');
	const { getLayerGroup } = getContext<LayerGroupContext>(layerGroupCtx) || {};

	let marker: Marker;

	export async function getMarker() {
		await tick();
		return marker;
	}

	setContext<LayerContext>(layerCtx, {
		getLayer: getMarker
	});
	setContext<MarkerContext>(markerCtx, {
		getMarker
	});

	const dispatch = createEventDispatcher<MarkerEvents>();
	let eventBridge: EventBridge<Marker>;

	//let initial = true;
	onMount(async () => {
		const L = await import('leaflet');

		marker = L.marker(latLng, {
			...options,
			icon: L.divIcon({ className: 'no-styles' }),
			zIndexOffset,
			opacity
		});
		marker.addTo(getLayerGroup ? await getLayerGroup() : await getMap());
		eventBridge = new EventBridge(marker, dispatch, events);
	});

	$: if (marker) marker.setLatLng(latLng);
	$: if (marker) marker.setZIndexOffset(zIndexOffset);
	$: if (marker) marker.setOpacity(opacity);

	onDestroy(async () => {
		if (eventBridge) eventBridge.unregister();
		if (marker) marker.removeFrom(await getMap());
	});
</script>

{#if marker}
	<slot />
{/if}
