import { BROWSER } from 'esm-env';
import { getContext, setContext } from 'svelte';

/**
 * @type {import('leaflet').DivOverlay}
 */
let DO;
if (BROWSER) {
	const L = await import('leaflet');
	DO = class DivOveray extends L.DivOverlay {
		options = {
			// @option pane: String = 'tooltipPane'
			// `Map pane` where the tooltip will be added.
			pane: 'tooltipPane',

			// @option offset: Point = Point(0, 0)
			// Optional offset of the tooltip position.
			offset: [0, 0],

			// @option direction: String = 'auto'
			// Direction where to open the tooltip. Possible values are: `right`, `left`,
			// `top`, `bottom`, `center`, `auto`.
			// `auto` will dynamically switch between `right` and `left` according to the tooltip
			// position on the map.
			direction: 'auto',

			// @option permanent: Boolean = false
			// Whether to open the tooltip permanently or only on mouseover.
			permanent: false,

			// @option sticky: Boolean = false
			// If true, the tooltip will follow the mouse instead of being fixed at the feature center.
			sticky: false,

			// @option opacity: Number = 0.9
			// Tooltip container opacity.
			opacity: 0.9
		};

		_initLayout() {
			var prefix = 'leaflet-overlay',
				className =
					prefix +
					' ' +
					(this.options.className || '') +
					' leaflet-zoom-' +
					(this._zoomAnimated ? 'animated' : 'hide');

			this._contentNode = this._container = L.DomUtil.create('div', className);

			this._container.setAttribute('role', 'overlay');
			this._container.setAttribute('id', 'leaflet-overlay-' + L.Util.stamp(this));
		}
		_updateLayout() {}
		_adjustPan() {}
		//TODO: this seems wrong
		// getEvents() {
		// 	return [];
		// }
	};
}

const DIV_OVERLAY_CTX = Symbol('DIV_OVERLAY_CTX');
class DivOverlayContext {
	/**
	 * @type {import('leaflet').DivOverlay | undefined}
	 */
	divOverlay = $state(undefined);
}

function setDivOverlayContext() {
	return setContext(DIV_OVERLAY_CTX, new DivOverlayContext());
}

/**
 *
 * @returns {ReturnType<typeof setDivOverlayContext>}
 */
function getDivOverlayContext() {
	return getContext(DIV_OVERLAY_CTX);
}

export { DO as DivOverlay, getDivOverlayContext, setDivOverlayContext };
