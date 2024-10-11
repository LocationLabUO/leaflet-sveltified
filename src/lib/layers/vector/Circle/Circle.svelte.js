import { getContext, setContext } from 'svelte';

const CIRCLE_CTX = Symbol('CIRCLE_CTX');
class CircleContext {
	/**
	 * @type {import('leaflet').Circle | undefined}
	 */
	circle = $state(undefined);
}

function setCircleContext() {
	return setContext(CIRCLE_CTX, new CircleContext());
}

/**
 *
 * @returns {ReturnType<typeof setCircleContext>}
 */
function getCircleContext() {
	return getContext(CIRCLE_CTX);
}

export { getCircleContext, setCircleContext };
