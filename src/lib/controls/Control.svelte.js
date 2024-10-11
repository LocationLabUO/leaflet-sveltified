import { BROWSER } from 'esm-env';
import { getContext, setContext } from 'svelte';

/**
 * @type {import('leaflet').Control}
 */
let Cntrl;
if (BROWSER) {
	const L = await import('leaflet');
	Cntrl = class Control extends L.Control {
		options = {
			position: 'bottomleft',

			// @option maxWidth: Number = 100
			// Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
			maxWidth: 100,

			// @option metric: Boolean = True
			// Whether to show the metric scale line (m/km).
			metric: true,

			// @option imperial: Boolean = True
			// Whether to show the imperial scale line (mi/ft).
			imperial: true

			// @option updateWhenIdle: Boolean = false
			// If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
		};
		onAdd(map) {
			var className = 'leaflet-control-scale',
				container = L.DomUtil.create('div', className),
				options = this.options;

			map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
			map.whenReady(this._update, this);

			return container;
		}
		_update() {}
	};
}

const CONTROL_CTX = Symbol('CONTROL_CTX');
class ControlContext {
	/**
	 * @type {import('leaflet').Control | undefined}
	 */
	control = $state(undefined);
}

function setControlContext() {
	return setContext(CONTROL_CTX, new ControlContext());
}

/**
 *
 * @returns {ReturnType<typeof setControlContext>}
 */
function getControlContext() {
	return getContext(CONTROL_CTX);
}

export { Cntrl as Control, getControlContext, setControlContext };
