<script lang="ts">
	import {
		layerGroupCtx,
		layersControlCtx,
		mapCtx,
		type LayerGroupContext,
		type LayersControlContext,
		type MapContext
	} from '$lib';
	import EventBridge from '$lib/util/EventBridge';
	import type { TileLayer, TileLayerOptions } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount } from 'svelte';
	import type { TileLayerEvents } from './events';

	export let url: string;
	export let opacity = 1.0;
	export let zIndex = 1;
	export let options: TileLayerOptions = {};
	export let isControlBaseLayer: boolean = true;
	export let name: string = 'Tile Layer';
	export let selected: boolean = !isControlBaseLayer;
	export let events: (keyof TileLayerEvents)[] = [];

	let tileLayer: TileLayer;

	const { getMap } = getContext<MapContext>(mapCtx) || {};
	if (!getMap) throw Error('TileLayer must be nested under a LeafletMap');
	const { getLayerGroup } = getContext<LayerGroupContext>(layerGroupCtx) || {};
	const { getLayersControl } = getContext<LayersControlContext>(layersControlCtx) || {};

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge<TileLayer>;

	onMount(async () => {
		const L = await import('leaflet');
		tileLayer = L.tileLayer(url, { ...options, opacity, zIndex });

		eventBridge = new EventBridge(tileLayer, dispatch, events);

		if (getLayerGroup) {
			tileLayer.addTo(await getLayerGroup());
		} else if (getLayersControl) {
			const lc = await getLayersControl();

			lc.addBaseLayer(tileLayer, name);

			if (selected) tileLayer.addTo(await getMap());
		} else {
			tileLayer.addTo(await getMap());
		}
	});

	$: if (tileLayer) tileLayer.setUrl(url);
	$: if (tileLayer) tileLayer.setOpacity(opacity);
	$: if (tileLayer) tileLayer.setZIndex(zIndex);

	onDestroy(async () => {
		if (eventBridge) eventBridge.unregister();
		if (tileLayer) {
			if (getLayerGroup) {
				const lg = await getLayerGroup();
				lg.removeLayer(tileLayer);
			}
			tileLayer.removeFrom(await getMap());
			if (getLayersControl) {
				const layersControl = await getLayersControl();
				layersControl.removeLayer(tileLayer);
			}
		}
	});
</script>
