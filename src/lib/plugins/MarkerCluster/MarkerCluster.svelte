<script>
	import { setFeatureGroupContext } from '$lib/layers/FeatureGroup/FeatureGroup.svelte.js';
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { setLayerGroupContext } from '$lib/layers/LayerGroup/LayerGroups.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
	import { setMarkerClusterContext } from './MarkerCluster.svelte.js';

	/**
	 * @type {import('./MarkerCluster.d.ts').MarkerClusterProps}
	 */
	let { options, events, children } = $props();

	const parent = getParent();
	const markerClusterContext = setMarkerClusterContext();
	const layerContext = setLayerContext();
	const featureGroupContext = setFeatureGroupContext();
	const LayerGroupContext = setLayerGroupContext();

	$effect(async () => {
		await import('leaflet.markercluster');
		const L = await import('leaflet');
		markerClusterContext.cluster = L.markerClusterGroup(options);
		layerContext.layer = markerClusterContext.cluster;
		featureGroupContext.featureGroup = markerClusterContext.cluster;
		LayerGroupContext.layerGroup = markerClusterContext.cluster;

		markerClusterContext.cluster.addTo(parent);
	});

	$effect(() => {
		return () => {
			markerClusterContext.cluster.remove();
		};
	});

	//Events Effect
	$effect(() => {
		for (const key in events) {
			if (markerClusterContext.cluster && events[key]) {
				markerClusterContext.cluster.on(key, events[key]);
			}
		}

		return () => {
			for (const key in events) {
				markerClusterContext.cluster?.off(key);
			}
		};
	});
</script>

{#if markerClusterContext.cluster}
	{@render children?.()}
{/if}
