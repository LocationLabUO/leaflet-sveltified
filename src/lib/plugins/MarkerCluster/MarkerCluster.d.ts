import type { InteractiveLayerEventHandlers } from '$lib/util/EventHandlers.js';
import type { MarkerClusterGroupOptions, SpiderfyEventHandlerFn } from 'leaflet';
import type { Snippet } from 'svelte';

interface MarkerClusterEventHandlers extends InteractiveLayerEventHandlers, LayerEventHandlers {
	spiderfied?: SpiderfyEventHandlerFn | undefined;
	unspiderfied?: SpiderfyEventHandlerFn | undefined;
}

export interface MarkerClusterProps {
	options?: MarkerClusterGroupOptions;
	events?: MarkerClusterEventHandlers;
	children?: Snippet;
}
