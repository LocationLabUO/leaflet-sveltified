import { getContext, setContext } from 'svelte';

const PLOYLINE_CTX = Symbol('PLOYLINE_CTX');
class PolylineContext {
	/**
	 * @type {import('leaflet').Polyline | undefined}
	 */
	polyline = $state(undefined);
}

function setPolylineContext() {
	return setContext(PLOYLINE_CTX, new PolylineContext());
}

/**
 *
 * @returns {ReturnType<typeof setPolylineContext>}
 */
function getPolylineContext() {
	return getContext(PLOYLINE_CTX);
}

export { getPolylineContext, setPolylineContext };
