import { getContext, setContext } from 'svelte';

const MAP_CTX = Symbol('MAP_CTX');
class MapContext {
	/**
	 * @type {import('leaflet').Map | undefined}
	 */
	map = $state(undefined);
}

function setMapContext() {
	return setContext(MAP_CTX, new MapContext());
}

/**
 *
 * @returns {ReturnType<typeof setMapContext>}
 */
function getMapContext() {
	return getContext(MAP_CTX);
}

export { getMapContext, setMapContext };
