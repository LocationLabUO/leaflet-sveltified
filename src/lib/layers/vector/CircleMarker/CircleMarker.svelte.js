import { getContext, setContext } from 'svelte';

const CIRCLE_MARKER_CTX = Symbol('CIRCLE_MARKER_CTX');
class CircleMarkerContext {
	/**
	 * @type {import('leaflet').CircleMarker | undefined}
	 */
	circleMarker = $state(undefined);
}

function setCircleMarkerContext() {
	return setContext(CIRCLE_MARKER_CTX, new CircleMarkerContext());
}

/**
 *
 * @returns {ReturnType<typeof setCircleMarkerContext>}
 */
function getCircleMarkerContext() {
	return getContext(CIRCLE_MARKER_CTX);
}

export { getCircleMarkerContext, setCircleMarkerContext };

