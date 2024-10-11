import { getContext, setContext } from 'svelte';

const MARKER_CTX = Symbol('MARKER_CTX');
class MarkerContext {
	/**
	 * @type {import('leaflet').Marker | undefined}
	 */
	marker = $state(undefined);
}

function setMarkerContext() {
	return setContext(MARKER_CTX, new MarkerContext());
}

/**
 *
 * @returns {ReturnType<typeof setMarkerContext>}
 */
function getMarkerContext() {
	return getContext(MARKER_CTX);
}

export { getMarkerContext, setMarkerContext };
