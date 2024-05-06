<script lang="ts">
	import {
		layerCtx,
		polylineCtx,
		type LayerContext,
		type PolylineContext,
		type PolylineEvents
	} from '$lib';
	import { getParentStore, updateListeners } from '$lib/util/helpers';
	import type { LatLngExpression, Polyline, PolylineOptions } from 'leaflet';
	import { createEventDispatcher, onDestroy, onMount, setContext, tick } from 'svelte';
	import { writable } from 'svelte/store';

	export let latLngs: LatLngExpression[] | LatLngExpression[][];
	export let options: PolylineOptions = {};
	export let events: (keyof PolylineEvents)[] = [];

	const listeners = new Set<keyof PolylineEvents>();
	const polyline = writable<Polyline | undefined>();
	const parent = getParentStore();

	setContext<LayerContext>(layerCtx, polyline);
	setContext<PolylineContext>(polylineCtx, polyline);

	const dispatch = createEventDispatcher<PolylineEvents>();

	//let initial = true;
	onMount(async () => {
		$polyline = window.L.polyline(latLngs, options);

		if (!$parent) await tick();
		if ($parent) $polyline.addTo($parent);
	});

	$: if (latLngs) $polyline?.setLatLngs(latLngs);
	$: if (options) $polyline?.setStyle(options);
	$: if (events && $polyline) updateListeners($polyline, events, listeners, dispatch);

	onDestroy(async () => {
		if ($parent) $polyline?.remove();
		$polyline = undefined;
	});
</script>

{#if $polyline}
	<slot />
{/if}
