<script lang="ts">
	import {
		layerGroupCtx,
		layersControlCtx,
		mapCtx,
		type LayerGroupContext,
		type LayersControlContext,
		type MapContext
	} from '$lib';
	import type { TileLayer, WMSOptions, WMSParams } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount, tick } from 'svelte';
	import { writable } from 'svelte/store';
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

	let tileLayer = writable<TileLayer.WMS | undefined>();

	const map = getContext<MapContext>(mapCtx) || undefined;
	if (!map) throw Error('TileLayer must be nested under a LeafletMap');
	const layerGroup = getContext<LayerGroupContext>(layerGroupCtx);
	const layersControl = getContext<LayersControlContext>(layersControlCtx);

	const dispatch = createEventDispatcher();

	onMount(async () => {
		const L = await import('leaflet');
		$tileLayer = L.tileLayer.wms(url, { ...options, zIndex, opacity });

		await tick();

		if ($layerGroup) {
			$tileLayer.addTo($layerGroup);
		} else if ($layersControl) {
			$layersControl.addBaseLayer($tileLayer, name);

			if (selected && $map) $tileLayer.addTo($map);
		} else if ($map) {
			$tileLayer.addTo($map);
		}
	});

	$: if ($tileLayer) $tileLayer.setUrl(url);
	$: if ($tileLayer) $tileLayer.setOpacity(opacity);
	$: if ($tileLayer) $tileLayer.setZIndex(zIndex);
	$: if ($tileLayer) $tileLayer.setParams(wmsParams);
	$: if (events) updateListeners();

	let listeners = new Set<keyof TileLayerEvents>();
	function updateListeners() {
		if (!$tileLayer) return;
		const newEvents = new Set(events);
		for (const l of listeners) {
			if (newEvents.has(l)) newEvents.delete(l);
			else {
				$tileLayer.off(l);
				listeners.delete(l);
			}
		}
		for (const e of newEvents) {
			if (!listeners.has(e)) {
				$tileLayer.on(e, (ev) => dispatch(e, ev));
				listeners.add(e);
			}
		}
	}
	onDestroy(async () => {
		if ($layersControl && $tileLayer) $layersControl.removeLayer($tileLayer);
		if ($layerGroup && $tileLayer) $layerGroup.removeLayer($tileLayer);
		if ($map) $tileLayer?.removeFrom($map);
		$tileLayer = undefined;
	});
</script>
