<script lang="ts">
	import {
		featureGroupCtx,
		layerCtx,
		layerGroupCtx,
		mapCtx,
		type FeatureGroupContext,
		type LayerContext,
		type LayerGroupContext,
		type MapContext,
		type MapEvents
	} from '$lib';
	import type { Map, MapOptions } from 'leaflet';
	import { createEventDispatcher, onDestroy, onMount, setContext, tick } from 'svelte';

	import 'leaflet/dist/leaflet.css';
	import { writable } from 'svelte/store';

	export let container: HTMLElement;
	export let options: MapOptions = {
		center: [0, 0],
		zoom: 5
	};
	export let events: (keyof MapEvents)[] = [];

	let map = writable<Map | undefined>();
	let listeners: Set<keyof MapEvents> = new Set();

	export const getMap = async () => {
		await tick();
		return map;
	};

	setContext<MapContext>(mapCtx, map);
	setContext<LayerContext>(layerCtx, writable());
	setContext<LayerGroupContext>(layerGroupCtx, writable());
	setContext<FeatureGroupContext>(featureGroupCtx, writable());

	const dispatch = createEventDispatcher<MapEvents>();

	onMount(async () => {
		const L = await import('leaflet');
		$map = L.map(container, options);
		console.log($map);
	});

	onDestroy(() => {
		if ($map) $map.remove();
		container.classList.remove(
			'leaflet-container',
			'leaflet-touch',
			'leaflet-retina',
			'leaflet-fade-anim'
		);
		$map = undefined;
	});

	function updateListeners() {
		if (!$map) return;
		const newEvents = new Set(events);
		for (const l of listeners) {
			if (newEvents.has(l)) newEvents.delete(l);
			else {
				$map.off(l);
				listeners.delete(l);
			}
		}
		for (const e of newEvents) {
			if (!listeners.has(e)) {
				$map.on(e, (ev) => dispatch(e, ev));
				listeners.add(e);
			}
		}
	}

	$: if (events) updateListeners();
</script>

{#if $map}
	<slot />
{/if}
