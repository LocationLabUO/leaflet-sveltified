import { getContext, setContext } from 'svelte';

const LAYER_GRP_CTX = Symbol('LAYER_GRP_CTX');
class LayerGroupContext {
	/**
	 * @type {import('leaflet').LayerGroup | undefined}
	 */
	layerGroup = $state(undefined);
}

function setLayerGroupContext() {
	return setContext(LAYER_GRP_CTX, new LayerGroupContext());
}

/**
 *
 * @returns {ReturnType<typeof setLayerGroupContext>}
 */
function getLayerGroupContext() {
	return getContext(LAYER_GRP_CTX);
}

export { getLayerGroupContext, setLayerGroupContext };
