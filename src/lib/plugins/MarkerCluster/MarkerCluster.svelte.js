import { getContext, setContext } from 'svelte';

const MCLUSTER_CTX = Symbol('MCLUSTER_CTX');
class MarkerClusterContext {
	/**
	 * @type {import('leaflet').MarkerClusterGroup | undefined}
	 */
	cluster = $state(undefined);
}

function setMarkerClusterContext() {
	return setContext(MCLUSTER_CTX, new MarkerClusterContext());
}

/**
 *
 * @returns {ReturnType<typeof setMarkerClusterContext>}
 */
function getMarkerClusterContext() {
	return getContext(MCLUSTER_CTX);
}

export { getMarkerClusterContext, setMarkerClusterContext };
