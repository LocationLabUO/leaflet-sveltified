<script lang="ts">
	import {
		layerCtx,
		layerGroupCtx,
		mapCtx,
		rectangleCtx,
		type LayerContext,
		type LayerGroupContext,
		type MapContext,
		type RectangleContext,
		type RectangleEvents
	} from '$lib';
	import type { LatLngBoundsExpression, PolylineOptions, Rectangle } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount, setContext, tick } from 'svelte';
	import { writable } from 'svelte/store';

	export let latLngBounds: LatLngBoundsExpression;
	export let options: PolylineOptions = {};
	export let events: (keyof RectangleEvents)[] = [];

	const map = getContext<MapContext>(mapCtx) || undefined;
	if (!map) throw Error('Marker must be nested within a LeafletMap or a LayerGroup');
	const layerGroup = getContext<LayerGroupContext>(layerGroupCtx);

	let rectangle = writable<Rectangle | undefined>();

	setContext<LayerContext>(layerCtx, rectangle);
	setContext<RectangleContext>(rectangleCtx, rectangle);

	const dispatch = createEventDispatcher<RectangleEvents>();

	//let initial = true;
	onMount(async () => {
		const L = await import('leaflet');
		$rectangle = L.rectangle(latLngBounds, options);

		await tick();
		if ($map) $rectangle.addTo($layerGroup ? $layerGroup : $map);
	});

	$: if (latLngBounds) $rectangle?.setBounds(latLngBounds);
	$: if (options) $rectangle?.setStyle(options);
	$: if (events) updateListeners();

	let listeners = new Set<keyof RectangleEvents>();
	function updateListeners() {
		if (!$rectangle) return;
		const newEvents = new Set(events);
		for (const l of listeners) {
			if (newEvents.has(l)) newEvents.delete(l);
			else {
				$rectangle.off(l);
				listeners.delete(l);
			}
		}
		for (const e of newEvents) {
			if (!listeners.has(e)) {
				$rectangle.on(e, (ev) => dispatch(e, ev));
				listeners.add(e);
			}
		}
	}

	onDestroy(async () => {
		if ($rectangle && $layerGroup) $layerGroup.removeLayer($rectangle);
		if ($map) $rectangle?.removeFrom($map);
		$rectangle = undefined;
	});
</script>

{#if $rectangle}
	<slot />
{/if}
