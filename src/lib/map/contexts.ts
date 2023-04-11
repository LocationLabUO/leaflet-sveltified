import type { Map } from 'leaflet';
import type { Writable } from 'svelte/store';

export const mapCtx = Symbol('Map');
export type MapContext = Writable<Map | undefined>;
