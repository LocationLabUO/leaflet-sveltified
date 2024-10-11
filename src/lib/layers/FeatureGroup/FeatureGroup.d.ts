import type { InteractiveLayerEventHandlers } from '$lib/util/EventHandlers.js';
import type { LayerEventHandlerFn, LayerOptions } from 'leaflet';
import type { Snippet } from 'svelte';

interface FeatureGroupEventHandlers extends InteractiveLayerEventHandlers {
	layeradd?: LayerEventHandlerFn | undefined;
	layerremove?: LayerEventHandlerFn | undefined;
}

export interface FeatureGroupProps {
	options?: LayerOptions;
	children?: Snippet;

	events?: FeatureGroupEventHandlers;
}
