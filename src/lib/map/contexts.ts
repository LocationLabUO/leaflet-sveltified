import type { Map } from 'leaflet';

export const mapCtx = Symbol('Map');
export type MapContext = {
	getMap: () => Promise<Map>;
};
