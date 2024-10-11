import type { InteractiveLayerEventHandlers } from '$lib/util/EventHandlers.js';
import type { GeoJSONOptions, LayerEventHandlerFn } from 'leaflet';
import type { Snippet } from 'svelte';

interface GeoJSONEventHandlers extends InteractiveLayerEventHandlers {
	layeradd?: LayerEventHandlerFn | undefined;
	layerremove?: LayerEventHandlerFn | undefined;
}

export interface GeoJSONProps {
	data: GeoJSON.GeoJsonObject | GeoJSON.GeoJsonObject[];
	options?: GeoJSONOptions;
	children?: Snippet;

	events?: GeoJSONEventHandlers;
}
