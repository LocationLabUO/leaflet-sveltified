<script>
	import { untrack } from 'svelte';
	import { setFeatureGroupContext } from '$lib/layers/FeatureGroup/FeatureGroup.svelte.js';
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { setLayerGroupContext } from '$lib/layers/LayerGroup/LayerGroups.svelte.js';
	import { setupEvents } from '$lib/util/events.js';
	import { getParentContext } from '$lib/util/parent.js';
	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
	import { setMarkerClusterContext } from './MarkerCluster.svelte.js';

	/**
	 * @type {import('./MarkerCluster.d.ts').MarkerClusterProps}
	 */
	let { options, events, children } = $props();

	const { getParentValue } = getParentContext();
	const markerClusterContext = setMarkerClusterContext();
	const layerContext = setLayerContext();
	const featureGroupContext = setFeatureGroupContext();
	const layerGroupContext = setLayerGroupContext();

	// Initialization effect - only depends on parent
	// Props are read with untrack since they're only used at creation time
	$effect(() => {
		const parent = getParentValue();

		if (!parent) return;

		(async () => {
			await import('leaflet.markercluster');
			const L = await import('leaflet');
			// Read props inside untrack to avoid re-running effect when object references change
			const currentOptions = untrack(() => options);
			markerClusterContext.cluster = L.markerClusterGroup(currentOptions);
			layerContext.layer = markerClusterContext.cluster;
			featureGroupContext.featureGroup = markerClusterContext.cluster;
			layerGroupContext.layerGroup = markerClusterContext.cluster;
			markerClusterContext.cluster.addTo(parent);
		})();

		return () => {
			markerClusterContext.cluster?.remove();
			markerClusterContext.cluster = undefined;
		};
	});

	// Events effect
	$effect(() => {
		if (!markerClusterContext.cluster) return;
		return setupEvents(markerClusterContext.cluster, events);
	});
</script>

{#if markerClusterContext.cluster}
	{@render children?.()}
{/if}
