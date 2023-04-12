<script lang="ts">
	import {
		layerCtx,
		layerGroupCtx,
		mapCtx,
		polygonCtx,
		type LayerContext,
		type LayerGroupContext,
		type MapContext,
		type PolygonContext,
		type PolygonEvents
	} from '$lib';
	import type { Polygon, PolylineOptions } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount, setContext, tick } from 'svelte';
	import { writable } from 'svelte/store';

	export let latLngs: L.LatLngExpression[] | L.LatLngExpression[][];
	export let options: PolylineOptions = {};
	export let events: (keyof PolygonEvents)[] = [];

	const map = getContext<MapContext>(mapCtx) || undefined;
	if (!map) throw Error('Marker must be nested within a LeafletMap or a LayerGroup');
	const layerGroup = getContext<LayerGroupContext>(layerGroupCtx);

	let polygon = writable<Polygon | undefined>();

	setContext<LayerContext>(layerCtx, polygon);
	setContext<PolygonContext>(polygonCtx, polygon);

	const dispatch = createEventDispatcher<PolygonEvents>();

	//let initial = true;
	onMount(async () => {
		const L = await import('leaflet');
		$polygon = L.polygon(latLngs, options);

		await tick();
		if ($map) $polygon.addTo($layerGroup ? $layerGroup : $map);
	});

	$: if (latLngs) $polygon?.setLatLngs(latLngs);
	$: if (options) $polygon?.setStyle(options);
	$: if (events) updateListeners();

	let listeners = new Set<keyof PolygonEvents>();
	function updateListeners() {
		if (!$polygon) return;
		const newEvents = new Set(events);
		for (const l of listeners) {
			if (newEvents.has(l)) newEvents.delete(l);
			else {
				$polygon.off(l);
				listeners.delete(l);
			}
		}
		for (const e of newEvents) {
			if (!listeners.has(e)) {
				$polygon.on(e, (ev) => dispatch(e, ev));
				listeners.add(e);
			}
		}
	}

	onDestroy(async () => {
		if ($polygon && $layerGroup) $layerGroup.removeLayer($polygon);
		if ($map) $polygon?.removeFrom($map);
		$polygon = undefined;
	});
</script>

{#if $polygon}
	<slot />
{/if}
