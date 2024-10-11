import type { LeafletEventHandlerFnMap, MapOptions } from 'leaflet';
import type { Snippet } from 'svelte';

export interface LeafletMapProps {
	options: MapOptions;
	events?: LeafletEventHandlerFnMap;
	children?: Snippet;
}
