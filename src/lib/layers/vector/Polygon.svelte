<script lang="ts">
	import {
		layerCtx,
		polygonCtx,
		type LayerContext,
		type PolygonContext,
		type PolygonEvents
	} from '$lib';
	import { getParentStore, updateListeners } from '$lib/util/helpers';
	import type { LatLngExpression, Polygon, PolylineOptions } from 'leaflet';
	import { createEventDispatcher, onDestroy, onMount, setContext, tick } from 'svelte';
	import { writable } from 'svelte/store';

	export let latLngs: LatLngExpression[] | LatLngExpression[][];
	export let options: PolylineOptions = {};
	export let events: (keyof PolygonEvents)[] = [];

	const listeners = new Set<keyof PolygonEvents>();
	const polygon = writable<Polygon | undefined>();
	const parent = getParentStore();

	setContext<LayerContext>(layerCtx, polygon);
	setContext<PolygonContext>(polygonCtx, polygon);

	const dispatch = createEventDispatcher<PolygonEvents>();

	//let initial = true;
	onMount(async () => {
		const L = await import('leaflet');
		$polygon = L.polygon(latLngs, options);

		if (!$parent) await tick();
		if ($parent) $polygon.addTo($parent);
	});

	$: if (latLngs) $polygon?.setLatLngs(latLngs);
	$: if (options) $polygon?.setStyle(options);
	$: if (events && $polygon) updateListeners($polygon, events, listeners, dispatch);

	onDestroy(async () => {
		if ($parent) $polygon?.remove();
		$polygon = undefined;
	});
</script>

{#if $polygon}
	<slot />
{/if}
