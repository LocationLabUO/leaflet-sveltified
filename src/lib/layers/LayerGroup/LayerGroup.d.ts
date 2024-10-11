import type { InteractiveLayerEventHandlers } from '$lib/util/EventHandlers.js';
import type { LayerEventHandlerFn } from 'leaflet';
import type { Snippet } from 'svelte';

interface LayerGroupEventHandlers extends InteractiveLayerEventHandlers {
	layeradd?: LayerEventHandlerFn | undefined;
	layerremove?: LayerEventHandlerFn | undefined;
}

export interface LayerGroupProps {
	options?: InteractiveLayerOptions;
	children?: Snippet;
	events?: LayerGroupEventHandlers;
}
