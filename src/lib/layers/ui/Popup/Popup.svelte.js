import { getContext, setContext } from 'svelte';

const POPUP_CTX = Symbol('POPUP_CTX');
class PopupContext {
	/**
	 * @type {import('leaflet').Popup | undefined}
	 */
	popup = $state(undefined);
}

function setPopupContext() {
	return setContext(POPUP_CTX, new PopupContext());
}

/**
 *
 * @returns {ReturnType<typeof setPopupContext>}
 */
function getPopupContext() {
	return getContext(POPUP_CTX);
}

export { getPopupContext, setPopupContext };
