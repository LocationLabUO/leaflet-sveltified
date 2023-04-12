<script lang="ts">
	import {
		featureGroupCtx,
		layerCtx,
		layerGroupCtx,
		mapCtx,
		type FeatureGroupContext,
		type FeatureGroupEvents,
		type LayerContext,
		type LayerGroupContext,
		type MapContext
	} from '$lib';
	import type { FeatureGroup, LayerOptions } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount, setContext, tick } from 'svelte';

	import { updateListeners } from '$lib/util/helpers';
	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
	import { writable } from 'svelte/store';

	export let options: LayerOptions = {};
	export let events: (keyof FeatureGroupEvents)[] = [];

	const map = getContext<MapContext>(mapCtx) || undefined;
	if (!map) throw Error('FeatureGroup must be nested under a LeafletMap or LayerGroup');
	const layergroup = getContext<LayerGroupContext | undefined>(layerGroupCtx);

	const parent = layergroup ?? map;

	let featureGroup = writable<FeatureGroup | undefined>();

	setContext<LayerContext>(layerCtx, featureGroup);
	setContext<LayerGroupContext>(layerGroupCtx, featureGroup);
	setContext<FeatureGroupContext>(featureGroupCtx, featureGroup);

	const dispatch = createEventDispatcher<FeatureGroupEvents>();

	onMount(async () => {
		await import('leaflet');
		await import('leaflet.markercluster');
		const L = window['L']; //TODO: don't rely on global UMD
		$featureGroup = L.featureGroup([], options);

		if (!$parent) await tick();
		if ($parent) {
			$featureGroup.addTo($parent);
		}
	});

	onDestroy(async () => {
		console.log($parent);
		if ($parent && $featureGroup) $featureGroup.remove();
		$featureGroup = undefined;
	});

	const listeners = new Set<keyof FeatureGroupEvents>();

	$: if (events && $featureGroup) updateListeners($featureGroup, events, listeners, dispatch);
</script>

{#if $featureGroup}
	<slot />
{/if}
