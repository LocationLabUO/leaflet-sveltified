<script lang="ts">
	import {
		featureGroupCtx,
		layerCtx,
		layerGroupCtx,
		type FeatureGroupContext,
		type FeatureGroupEvents,
		type LayerContext,
		type LayerGroupContext
	} from '$lib';
	import type { FeatureGroup, LayerOptions, PathOptions } from 'leaflet';
	import { createEventDispatcher, onDestroy, onMount, setContext, tick } from 'svelte';

	import { getParentStore, updateListeners } from '$lib/util/helpers';
	import { writable } from 'svelte/store';

	export let options: LayerOptions = {};
	export let events: (keyof FeatureGroupEvents)[] = [];
	export let zIndex = 1;
	export let style: PathOptions = {};

	const listeners = new Set<keyof FeatureGroupEvents>();

	const featureGroup = writable<FeatureGroup | undefined>();
	const parent = getParentStore();

	setContext<LayerContext>(layerCtx, featureGroup);
	setContext<LayerGroupContext>(layerGroupCtx, featureGroup);
	setContext<FeatureGroupContext>(featureGroupCtx, featureGroup);

	const dispatch = createEventDispatcher<FeatureGroupEvents>();

	onMount(async () => {
		const L = await import('leaflet');
		$featureGroup = L.featureGroup([], options);

		if (!$parent) await tick();
		if ($parent) $featureGroup.addTo($parent);
	});

	onDestroy(async () => {
		if ($parent) $featureGroup?.remove();
		$featureGroup = undefined;
	});

	$: if (events && $featureGroup) updateListeners($featureGroup, events, listeners, dispatch);
	$: $featureGroup?.setZIndex(zIndex);
	$: $featureGroup?.setStyle(style);
</script>

{#if $featureGroup}
	<slot />
{/if}
