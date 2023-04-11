import type { MarkerClusterGroup } from 'leaflet';

export const markerClusterGroupCtx = Symbol('MarkerClusterGroup');
export type MarkerClusterGroupContext = {
	getMarkerClusterGroup: () => Promise<MarkerClusterGroup>;
};
