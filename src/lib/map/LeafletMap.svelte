<script lang="ts">
	import { mapCtx, type MapContext, type MapEvents } from '$lib';
	import type { Map, MapOptions } from 'leaflet';
	import { createEventDispatcher, onDestroy, onMount, setContext, tick } from 'svelte';

	import { updateListeners } from '$lib/util/helpers';
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
		return $map;
	};

	setContext<MapContext>(mapCtx, map);

	const dispatch = createEventDispatcher<MapEvents>();

	onMount(async () => {
		const L = await import('leaflet');
		$map = window.L.map(container, options);
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

	$: if (events && $map) updateListeners($map, events, listeners, dispatch);
	$: if($map && options.center) $map.setView(options.center, options.zoom); 
</script>

{#if $map}
	<slot />
{/if}
