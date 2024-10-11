import { getLayerContext } from '$lib/layers/Layer.svelte.js';
import { getLayerGroupContext } from '$lib/layers/LayerGroup/LayerGroups.svelte.js';
import { getMapContext } from '$lib/map/LeafletMap.svelte.js';

export function getParent() {
	const mapContext = getMapContext();
	if (!mapContext) throw Error('Layers must be nested under LeafletMap');

	const layerContext = getLayerContext();
	if (layerContext) return layerContext.layer;

	const layerGroupContext = getLayerGroupContext();
	if (layerGroupContext) return layerGroupContext.layerGroup;

	return mapContext.map;
}
