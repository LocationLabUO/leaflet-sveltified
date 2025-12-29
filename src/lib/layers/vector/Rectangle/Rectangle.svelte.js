import { getContext, setContext } from 'svelte';

const RECTANGLE_CTX = Symbol('RECTANGLE_CTX');
class RectangleContext {
	/**
	 * @type {import('leaflet').Rectangle | undefined}
	 */
	rectangle = $state(undefined);
}

function setRectangleContext() {
	return setContext(RECTANGLE_CTX, new RectangleContext());
}

/**
 *
 * @returns {ReturnType<typeof setRectangleContext>}
 */
function getRectangleContext() {
	return getContext(RECTANGLE_CTX);
}

export { getRectangleContext, setRectangleContext };

