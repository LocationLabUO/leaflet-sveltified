import type { MarkerClusterGroup } from 'leaflet';
import type { Writable } from 'svelte/store';

export const markerClusterGroupCtx = Symbol('MarkerClusterGroup');
export type MarkerClusterGroupContext = Writable<MarkerClusterGroup | undefined>;
