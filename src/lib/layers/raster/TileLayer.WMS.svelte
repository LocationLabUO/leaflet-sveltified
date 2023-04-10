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
	import type { TileLayer, WMSOptions, WMSParams } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount } from 'svelte';
	import type { TileLayerEvents } from './events';

	export let url: string;
	export let opacity = 1.0;
	export let zIndex = 1;
	export let options: WMSOptions = {};
	export let wmsParams: WMSParams = {
		layers: ''
	};
	export let events: (keyof TileLayerEvents)[] = [];
	export let isControlBaseLayer: boolean = true;
	export let name: string = 'WMS Layer';
	export let selected: boolean = !isControlBaseLayer;

	let wmsLayer: TileLayer.WMS;

	const { getMap } = getContext<MapContext>(mapCtx) || {};
	if (!getMap) throw Error('TileLayer must be nested under a LeafletMap');
	const { getLayerGroup } = getContext<LayerGroupContext>(layerGroupCtx) || {};
	const { getLayersControl } = getContext<LayersControlContext>(layersControlCtx) || {};

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge<TileLayer>;

	onMount(async () => {
		const L = await import('leaflet');
		wmsLayer = L.tileLayer.wms(url, { ...options, zIndex, opacity });

		eventBridge = new EventBridge(wmsLayer, dispatch, events);

		if (getLayerGroup) {
			wmsLayer.addTo(await getLayerGroup());
		} else if (getLayersControl) {
			const lc = await getLayersControl();

			lc.addBaseLayer(wmsLayer, name);

			if (selected) wmsLayer.addTo(await getMap());
		} else {
			wmsLayer.addTo(await getMap());
		}
	});

	$: if (wmsLayer) wmsLayer.setUrl(url);
	$: if (wmsLayer) wmsLayer.setOpacity(opacity);
	$: if (wmsLayer) wmsLayer.setZIndex(zIndex);
	$: if (wmsLayer) wmsLayer.setParams(wmsParams);

	onDestroy(async () => {
		if (eventBridge) eventBridge.unregister();
		if (wmsLayer) {
			if (getLayerGroup) {
				const lg = await getLayerGroup();
				lg.removeLayer(wmsLayer);
			}
			wmsLayer.removeFrom(await getMap());
			if (getLayersControl) {
				const layersControl = await getLayersControl();
				layersControl.removeLayer(wmsLayer);
			}
		}
	});
</script>
