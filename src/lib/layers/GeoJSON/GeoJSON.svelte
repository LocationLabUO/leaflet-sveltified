<script>
	import { setFeatureGroupContext } from '$lib/layers/FeatureGroup/FeatureGroup.svelte.js';
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import { setGeoJSONContext } from './GeoJSON.svelte.js';

	const parent = getParent();
	const context = setGeoJSONContext();
	const layerContext = setLayerContext();
	const featureGroupContext = setFeatureGroupContext();

	/**
	 * @type {import('./GeoJSON.d.ts').GeoJSONProps}
	 */
	let { data, options, events, children } = $props();

	$effect(async () => {
		const L = await import('leaflet');
		context.geoJSON = L.geoJSON(data, options);
		layerContext.layer = context.geoJSON;
		featureGroupContext.featureGroup = context.geoJSON;
		context.geoJSON.addTo(parent);
	});

	//onDestroy
	$effect(() => {
		return () => {
			if (context.geoJSON) {
				context.geoJSON.remove();
			}
		};
	});

	//Events Effect
	$effect(() => {
		for (const key in events) {
			if (context.geoJSON && events[key]) {
				context.geoJSON.on(key, events[key]);
			}
		}
		return () => {
			for (const key in events) {
				context.geoJSON?.off(key);
			}
		};
	});
</script>

{#if context.geoJSON}
	{@render children?.()}
{/if}
