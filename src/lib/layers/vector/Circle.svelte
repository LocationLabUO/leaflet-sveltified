<script lang="ts">
	import {
		layerCtx,
		layerGroupCtx,
		mapCtx,
		rectangleCtx,
		type CircleContext,
		type CircleEvents,
		type LayerContext,
		type LayerGroupContext,
		type MapContext
	} from '$lib';
	import type { Circle, LatLngExpression, PathOptions } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount, setContext, tick } from 'svelte';
	import { writable } from 'svelte/store';

	export let latLng: LatLngExpression;
	export let radius: number;
	export let options: PathOptions = {};
	export let events: (keyof CircleEvents)[] = [];

	const map = getContext<MapContext>(mapCtx) || undefined;
	if (!map) throw Error('Marker must be nested within a LeafletMap or a LayerGroup');
	const layerGroup = getContext<LayerGroupContext>(layerGroupCtx);

	let circle = writable<Circle | undefined>();

	setContext<LayerContext>(layerCtx, circle);
	setContext<CircleContext>(rectangleCtx, circle);

	const dispatch = createEventDispatcher<CircleEvents>();

	//let initial = true;
	onMount(async () => {
		const L = await import('leaflet');
		$circle = L.circle(latLng, { ...options, radius });

		await tick();
		if ($map) $circle.addTo($layerGroup ? $layerGroup : $map);
	});

	$: if (latLng) $circle?.setLatLng(latLng);
	$: if (radius) $circle?.setRadius(radius);
	$: if (options) $circle?.setStyle(options);
	$: if (events) updateListeners();

	let listeners = new Set<keyof CircleEvents>();
	function updateListeners() {
		if (!$circle) return;
		const newEvents = new Set(events);
		for (const l of listeners) {
			if (newEvents.has(l)) newEvents.delete(l);
			else {
				$circle.off(l);
				listeners.delete(l);
			}
		}
		for (const e of newEvents) {
			if (!listeners.has(e)) {
				$circle.on(e, (ev) => dispatch(e, ev));
				listeners.add(e);
			}
		}
	}

	onDestroy(async () => {
		if ($circle && $layerGroup) $layerGroup.removeLayer($circle);
		if ($map) $circle?.removeFrom($map);
		$circle = undefined;
	});
</script>

{#if $circle}
	<slot />
{/if}
