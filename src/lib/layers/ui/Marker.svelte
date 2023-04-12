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
	import { writable } from 'svelte/store';

	export let latLng: LatLngExpression;
	export let zIndexOffset = 0;
	export let opacity = 1.0;
	export let options: MarkerOptions | undefined = {};
	export let events: (keyof MarkerEvents)[] = [];

	const map = getContext<MapContext>(mapCtx) || undefined;
	if (!map) throw Error('Marker must be nested within a LeafletMap or a LayerGroup');
	const layerGroup = getContext<LayerGroupContext>(layerGroupCtx);

	let marker = writable<Marker | undefined>();

	setContext<LayerContext>(layerCtx, marker);
	setContext<MarkerContext>(markerCtx, marker);

	const dispatch = createEventDispatcher<MarkerEvents>();

	//let initial = true;
	onMount(async () => {
		const L = await import('leaflet');

		await tick();
		$marker = L.marker(latLng, {
			...options,
			icon: L.divIcon({ className: 'no-styles' }),
			zIndexOffset,
			opacity
		});

		if ($map) $marker.addTo($layerGroup ? $layerGroup : $map);
	});

	$: if ($marker) $marker.setLatLng(latLng);
	$: if ($marker) $marker.setZIndexOffset(zIndexOffset);
	$: if ($marker) $marker.setOpacity(opacity);
	$: if (events) updateListeners();

	let listeners = new Set<keyof MarkerEvents>();
	function updateListeners() {
		if (!$marker) return;
		const newEvents = new Set(events);
		for (const l of listeners) {
			if (newEvents.has(l)) newEvents.delete(l);
			else {
				$marker.off(l);
				listeners.delete(l);
			}
		}
		for (const e of newEvents) {
			if (!listeners.has(e)) {
				$marker.on(e, (ev) => dispatch(e, ev));
				listeners.add(e);
			}
		}
	}

	onDestroy(async () => {
		if ($marker && $layerGroup) $layerGroup.removeLayer($marker);
		if ($map) $marker?.removeFrom($map);
		$marker = undefined;
	});
</script>

{#if $marker}
	<slot />
{/if}
