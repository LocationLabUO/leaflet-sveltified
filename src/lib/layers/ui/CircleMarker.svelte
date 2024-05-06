<script lang="ts">
	import type L from 'leaflet';
	import { createEventDispatcher, onDestroy, onMount, setContext, tick } from 'svelte';

	import { getParentStore, updateListeners } from '$lib/util/helpers';
	import type { CircleMarker } from 'leaflet';
	import { writable } from 'svelte/store';
	import { layerCtx, type LayerContext } from '../contexts';
	import { circleMarkerCtx, type CircleMarkerContenxt } from './contexts';
	import type { MarkerEvents } from './events';

	export let latLng: L.LatLngExpression;
	export let radius: number;
	export let options: L.PathOptions = {};
	export let events: (keyof MarkerEvents)[] = [];

	const listeners = new Set<keyof MarkerEvents>();
	const circleMarker = writable<CircleMarker | undefined>();

	let parent = getParentStore();

	setContext<LayerContext>(layerCtx, circleMarker);
	setContext<CircleMarkerContenxt>(circleMarkerCtx, circleMarker);

	const dispatch = createEventDispatcher<MarkerEvents>();

	//let initial = true;
	onMount(async () => {
		$circleMarker = window.L.circleMarker(latLng, { ...options, radius });

		if (!$parent) await tick();
		if ($parent) $circleMarker.addTo($parent);
	});

	$: if ($circleMarker) $circleMarker.setLatLng(latLng);
	$: if ($circleMarker) $circleMarker.setRadius(radius);
	$: if ($circleMarker) $circleMarker.setStyle(options);
	$: if (events && $circleMarker) updateListeners($circleMarker, events, listeners, dispatch);

	onDestroy(async () => {
		if ($circleMarker && $parent) $parent.removeLayer($circleMarker);
		$circleMarker = undefined;
	});
</script>

{#if circleMarker}
	<slot />
{/if}
