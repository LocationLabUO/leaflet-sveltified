import { getContext, setContext } from 'svelte';

const PATH_CTX = Symbol('PATH_CTX');
class PathContext {
	/**
	 * @type {import('leaflet').Path | undefined}
	 */
	path = $state(undefined);
}

function setPathContext() {
	return setContext(PATH_CTX, new PathContext());
}

/**
 *
 * @returns {ReturnType<typeof setPathContext>}
 */
function getPathContext() {
	return getContext(PATH_CTX);
}

export { getPathContext, setPathContext };
