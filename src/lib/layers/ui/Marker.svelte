<script lang="ts">
	import type { LatLngExpression, Marker, MarkerOptions } from 'leaflet';
	import { createEventDispatcher, onDestroy, onMount, setContext, tick } from 'svelte';

	import {
		layerCtx,
		markerCtx,
		type LayerContext,
		type MarkerContext,
		type MarkerEvents
	} from '$lib';
	import { getParentStore, updateListeners } from '$lib/util/helpers';
	import { writable } from 'svelte/store';

	export let latLng: LatLngExpression;
	export let zIndexOffset = 0;
	export let opacity = 1.0;
	export let options: MarkerOptions | undefined = {};
	export let events: (keyof MarkerEvents)[] = [];

	const listeners = new Set<keyof MarkerEvents>();
	const marker = writable<Marker | undefined>();

	let parent = getParentStore();

	setContext<LayerContext>(layerCtx, marker);
	setContext<MarkerContext>(markerCtx, marker);

	const dispatch = createEventDispatcher<MarkerEvents>();

	//let initial = true;
	onMount(async () => {
		$marker = window.L.marker(latLng, {
			...options,
			icon: window.L.divIcon({ className: 'no-styles' }),
			zIndexOffset,
			opacity
		});

		if (!$parent) await tick();
		if ($parent) $marker.addTo($parent);
	});

	$: if ($marker) $marker.setLatLng(latLng);
	$: if ($marker) $marker.setZIndexOffset(zIndexOffset);
	$: if ($marker) $marker.setOpacity(opacity);
	$: if (events && $marker) updateListeners($marker, events, listeners, dispatch);

	onDestroy(async () => {
		if ($marker && $parent) $parent.removeLayer($marker);
		$marker = undefined;
	});
</script>

{#if $marker}
	<slot />
{/if}
