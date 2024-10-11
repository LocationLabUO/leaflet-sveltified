import { getContext, setContext } from 'svelte';

const ATTRIBUTION_CONTROL_CTX = Symbol('ATTRIBUTION_CONTROL_CTX');
class AttributionControlContext {
	/**
	 * @type {import('leaflet').Control.Scale | undefined}
	 */
	attributionControl = $state(undefined);
}

function setAttributionControlContext() {
	return setContext(ATTRIBUTION_CONTROL_CTX, new AttributionControlContext());
}

/**
 *
 * @returns {ReturnType<typeof setAttributionControlContext>}
 */
function getAttributionControlContext() {
	return getContext(ATTRIBUTION_CONTROL_CTX);
}

export { getAttributionControlContext, setAttributionControlContext };
