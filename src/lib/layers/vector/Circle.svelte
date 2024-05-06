<script lang="ts">
	import {
		layerCtx,
		rectangleCtx,
		type CircleContext,
		type CircleEvents,
		type LayerContext
	} from '$lib';
	import { getParentStore, updateListeners } from '$lib/util/helpers';
	import type { Circle, LatLngExpression, PathOptions } from 'leaflet';
	import { createEventDispatcher, onDestroy, onMount, setContext, tick } from 'svelte';
	import { writable } from 'svelte/store';

	export let latLng: LatLngExpression;
	export let radius: number;
	export let options: PathOptions = {};
	export let events: (keyof CircleEvents)[] = [];

	let circle = writable<Circle | undefined>();
	const parent = getParentStore();

	setContext<LayerContext>(layerCtx, circle);
	setContext<CircleContext>(rectangleCtx, circle);

	const dispatch = createEventDispatcher<CircleEvents>();

	//let initial = true;
	onMount(async () => {
		$circle = window.L.circle(latLng, { ...options, radius });

		if (!$parent) await tick();
		if ($parent) $circle.addTo($parent);
	});

	let listeners = new Set<keyof CircleEvents>();

	$: if (latLng) $circle?.setLatLng(latLng);
	$: if (radius) $circle?.setRadius(radius);
	$: if (options) $circle?.setStyle(options);
	$: if (events && $circle) updateListeners($circle, events, listeners, dispatch);

	onDestroy(async () => {
		if ($circle && $parent) $circle.remove();
		$circle = undefined;
	});
</script>

{#if $circle}
	<slot />
{/if}
