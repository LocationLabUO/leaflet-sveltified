import { getContext, setContext } from 'svelte';

const SCALE_CONTROL_CTX = Symbol('SCALE_CONTROL_CTX');
class ScaleControlContext {
	/**
	 * @type {import('leaflet').Control.Scale | undefined}
	 */
	scaleControl = $state(undefined);
}

function setScaleControlContext() {
	return setContext(SCALE_CONTROL_CTX, new ScaleControlContext());
}

/**
 *
 * @returns {ReturnType<typeof setScaleControlContext>}
 */
function getScaleControlContext() {
	return getContext(SCALE_CONTROL_CTX);
}

export { getScaleControlContext, setScaleControlContext };
