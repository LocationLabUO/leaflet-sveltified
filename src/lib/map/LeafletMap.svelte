<script lang="ts">
	import { mapCtx, type MapContext, type MapEvents } from '$lib';
	import EventBridge from '$lib/util/EventBridge';
	import type { Map, MapOptions } from 'leaflet';
	import { createEventDispatcher, onDestroy, onMount, setContext, tick } from 'svelte';

	import 'leaflet/dist/leaflet.css';

	export let container: HTMLElement;
	export let options: MapOptions = {
		center: [0, 0],
		zoom: 5
	};
	export let events: (keyof MapEvents)[] = [];

	let map: Map;

	export const getMap = async () => {
		await tick();
		return map;
	};
	setContext<MapContext>(mapCtx, { getMap });

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge<Map>;

	onMount(async () => {
		const L = await import('leaflet');
		map = L.map(container, options);
		eventBridge = new EventBridge(map, dispatch, events);
	});

	onDestroy(async () => {
		if (map) map.remove();
		if (eventBridge) eventBridge.unregister();
	});
</script>

{#if map}
	<slot />
{/if}
