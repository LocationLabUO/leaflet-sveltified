import { getLayerContext } from '$lib/layers/Layer.svelte.js';
import { getLayerGroupContext } from '$lib/layers/LayerGroup/LayerGroups.svelte.js';
import { getMapContext } from '$lib/map/LeafletMap.svelte.js';

/**
 * Gets the parent container (Map, LayerGroup, or FeatureGroup) for adding layers.
 *
 * IMPORTANT: For reactive updates, call this inside $effect or use getParentContext().
 * Calling at component init captures undefined since Leaflet loads asynchronously.
 *
 * @returns {import('leaflet').Map | import('leaflet').LayerGroup | import('leaflet').FeatureGroup | undefined}
 */
export function getParent() {
	const mapContext = getMapContext();
	if (!mapContext) throw Error('Layers must be nested under LeafletMap');

	const layerContext = getLayerContext();
	if (layerContext?.layer) return layerContext.layer;

	const layerGroupContext = getLayerGroupContext();
	if (layerGroupContext?.layerGroup) return layerGroupContext.layerGroup;

	return mapContext.map;
}

/**
 * Gets the parent contexts for reactive access inside $effect.
 * Use this when you need to reactively wait for the parent to be ready.
 *
 * @example
 * const { mapContext, layerContext, layerGroupContext, getParentValue } = getParentContext();
 *
 * $effect(() => {
 *   const parent = getParentValue();
 *   if (!parent) return; // Not ready yet, effect will re-run when parent is set
 *   // ... use parent
 * });
 *
 * @returns {{ mapContext: object, layerContext: object | undefined, layerGroupContext: object | undefined, getParentValue: () => any }}
 */
export function getParentContext() {
	const mapContext = getMapContext();
	if (!mapContext) throw Error('Layers must be nested under LeafletMap');

	const layerContext = getLayerContext();
	const layerGroupContext = getLayerGroupContext();

	return {
		mapContext,
		layerContext,
		layerGroupContext,
		/**
		 * Get the current parent value. Call this inside $effect for reactivity.
		 */
		getParentValue() {
			if (layerContext?.layer) return layerContext.layer;
			if (layerGroupContext?.layerGroup) return layerGroupContext.layerGroup;
			return mapContext.map;
		}
	};
}
