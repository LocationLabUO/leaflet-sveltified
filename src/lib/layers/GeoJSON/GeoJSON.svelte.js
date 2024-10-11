import { getContext, setContext } from 'svelte';

const GEO_JSON_GRP_CTX = Symbol('GEO_JSON_GRP_CTX');
class GeoJSONContext {
	/**
	 * @type {import('leaflet').GeoJSON | undefined}
	 */
	geoJSON = $state(undefined);
}

function setGeoJSONContext() {
	return setContext(GEO_JSON_GRP_CTX, new GeoJSONContext());
}

/**
 *
 * @returns {ReturnType<typeof setGeoJSONContext>}
 */
function getGeoJSONContext() {
	return getContext(GEO_JSON_GRP_CTX);
}

export { getGeoJSONContext, setGeoJSONContext };
