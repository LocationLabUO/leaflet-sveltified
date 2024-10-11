import { getContext, setContext } from 'svelte';

const ZOOM_CONTROL_CTX = Symbol('ZOOM_CONTROL_CTX');
class ZoomControlContext {
	/**
	 * @type {import('leaflet').Control.Zoom | undefined}
	 */
	zoomControl = $state(undefined);
}

function setZoomControlContext() {
	return setContext(ZOOM_CONTROL_CTX, new ZoomControlContext());
}

/**
 *
 * @returns {ReturnType<typeof setZoomControlContext>}
 */
function getZoomControlContext() {
	return getContext(ZOOM_CONTROL_CTX);
}

export { getZoomControlContext, setZoomControlContext };
