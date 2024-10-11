import { getContext, setContext } from 'svelte';

const POLYGON_CTX = Symbol('POLYGON_CTX');
class PolygonContext {
	/**
	 * @type {import('leaflet').Polygon | undefined}
	 */
	polygon = $state(undefined);
}

function setPolygonContext() {
	return setContext(POLYGON_CTX, new PolygonContext());
}

/**
 *
 * @returns {ReturnType<typeof setPolygonContext>}
 */
function getPolygonContext() {
	return getContext(POLYGON_CTX);
}

export { getPolygonContext, setPolygonContext };
