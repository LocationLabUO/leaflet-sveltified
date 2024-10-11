import { getContext, setContext } from 'svelte';

const FEATURE_GRP_CTX = Symbol('Feature_GRP_CTX');
class FeatureGroupContext {
	/**
	 * @type {import('leaflet').FeatureGroup | undefined}
	 */
	featureGroup = $state(undefined);
}

function setFeatureGroupContext() {
	return setContext(FEATURE_GRP_CTX, new FeatureGroupContext());
}

/**
 *
 * @returns {ReturnType<typeof setFeatureGroupContext>}
 */
function getFeatureGroupContext() {
	return getContext(FEATURE_GRP_CTX);
}

export { getFeatureGroupContext, setFeatureGroupContext };
