import { getContext, setContext } from 'svelte';

const TOOLTIP_CTX = Symbol('TOOLTIP_CTX');
class TooltipContext {
	/**
	 * @type {import('leaflet').Tooltip | undefined}
	 */
	tooltip = $state(undefined);
}

function setTooltipContext() {
	return setContext(TOOLTIP_CTX, new TooltipContext());
}

/**
 *
 * @returns {ReturnType<typeof setTooltipContext>}
 */
function getTooltipContext() {
	return getContext(TOOLTIP_CTX);
}

export { getTooltipContext, setTooltipContext };
