<script lang="ts">
	import {
		layerGroupCtx,
		layersControlCtx,
		mapCtx,
		type LayerGroupContext,
		type LayersControlContext,
		type MapContext,
		type TileLayerEvents
	} from '$lib';
	import type { TileLayer, TileLayerOptions } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount, tick } from 'svelte';
	import { writable } from 'svelte/store';

	export let url: string;
	export let opacity = 1.0;
	export let zIndex = 1;
	export let options: TileLayerOptions = {};
	export let isControlBaseLayer: boolean = true;
	export let name: string = 'Tile Layer';
	export let selected: boolean = !isControlBaseLayer;
	export let events: (keyof TileLayerEvents)[] = [];

	let tileLayer = writable<TileLayer | undefined>();

	const map = getContext<MapContext>(mapCtx);
	const layerGroup = getContext<LayerGroupContext>(layerGroupCtx) || undefined;
	const layersControl = getContext<LayersControlContext>(layersControlCtx) || undefined;

	const dispatch = createEventDispatcher();

	onMount(async () => {
		const L = await import('leaflet');
		$tileLayer = L.tileLayer(url, { ...options, opacity, zIndex });
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
