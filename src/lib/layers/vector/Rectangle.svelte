<script lang="ts">
	import {
		layerCtx,
		rectangleCtx,
		type LayerContext,
		type RectangleContext,
		type RectangleEvents
	} from '$lib';
	import type { LatLngBoundsExpression, PolylineOptions, Rectangle } from 'leaflet';
	import { createEventDispatcher, onDestroy, onMount, setContext, tick } from 'svelte';

	import { getParentStore, updateListeners } from '$lib/util/helpers';
	import { writable } from 'svelte/store';

	export let latLngBounds: LatLngBoundsExpression;
	export let options: PolylineOptions = {};
	export let events: (keyof RectangleEvents)[] = [];

	const listeners = new Set<keyof RectangleEvents>();
	const rectangle = writable<Rectangle | undefined>();
	const parent = getParentStore();

	setContext<LayerContext>(layerCtx, rectangle);
	setContext<RectangleContext>(rectangleCtx, rectangle);

	const dispatch = createEventDispatcher<RectangleEvents>();

	//let initial = true;
	onMount(async () => {
		$rectangle = window.L.rectangle(latLngBounds, options);

		if (!$parent) await tick();
		if ($parent) $rectangle.addTo($parent);
	});

	onDestroy(async () => {
		if ($parent) $rectangle?.remove();
		$rectangle = undefined;
	});

	$: if (events && $rectangle) updateListeners($rectangle, events, listeners, dispatch);
	$: if (latLngBounds) $rectangle?.setBounds(latLngBounds);
	$: if (options) $rectangle?.setStyle(options);
</script>

{#if $rectangle}
	<slot />
{/if}
