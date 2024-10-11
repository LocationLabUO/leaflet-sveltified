import { getContext, setContext } from 'svelte';

const LAYER_CTX = Symbol('LAYER_CTX');
class LayerContext {
	/**
	 * @type {import('leaflet').Layer | undefined}
	 */
	layer = $state(undefined);
}

function setLayerContext() {
	return setContext(LAYER_CTX, new LayerContext());
}

/**
 *
 * @returns {ReturnType<typeof setLayerContext>}
 */
function getLayerContext() {
	return getContext(LAYER_CTX);
}

export { getLayerContext, setLayerContext };
