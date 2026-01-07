<script>
	import { untrack } from 'svelte';
	import { setFeatureGroupContext } from '$lib/layers/FeatureGroup/FeatureGroup.svelte.js';
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { setupEvents } from '$lib/util/events.js';
	import { getParentContext } from '$lib/util/parent.js';
	import { setGeoJSONContext } from './GeoJSON.svelte.js';

	const { getParentValue } = getParentContext();
	const context = setGeoJSONContext();
	const layerContext = setLayerContext();
	const featureGroupContext = setFeatureGroupContext();

	/**
	 * @type {import('./GeoJSON.d.ts').GeoJSONProps}
	 */
	let { data, options, events, children } = $props();

	// Initialization effect - only depends on parent
	// Props are read with untrack since they're only used at creation time
	$effect(() => {
		const parent = getParentValue();

		if (!parent) return;

		(async () => {
			const L = await import('leaflet');
			// Read props inside untrack to avoid re-running effect when object references change
			const currentData = untrack(() => data);
			const currentOptions = untrack(() => options);
			context.geoJSON = L.geoJSON(currentData, currentOptions);
			layerContext.layer = context.geoJSON;
			featureGroupContext.featureGroup = context.geoJSON;
			context.geoJSON.addTo(parent);
		})();

		return () => {
			context.geoJSON?.remove();
			context.geoJSON = undefined;
		};
	});

	// Events effect
	$effect(() => {
		if (!context.geoJSON) return;
		return setupEvents(context.geoJSON, events);
	});
</script>

{#if context.geoJSON}
	{@render children?.()}
{/if}
