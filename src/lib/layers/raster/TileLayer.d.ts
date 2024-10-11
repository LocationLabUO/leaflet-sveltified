import type {
	GridLayerEventHandlers,
	LayerEventHandlers,
	PopupEventsHandlers,
	TooltipEventHandlers
} from '$lib/util/EventHandlers.js';
import type { TileEventHandlerFn, TileLayerOptions } from 'leaflet';
import type { Snippet } from 'svelte';

interface TileLayerEventHandlers
	extends GridLayerEventHandlers,
		LayerEventHandlers,
		PopupEventsHandlers,
		TooltipEventHandlers {
	tileabort?: TileEventHandlerFn | undefined;
}

export interface TileLayerProps {
	url: string;
	options?: TileLayerOptions;
	events?: TileLayerEventHandlers;
	children?: Snippet;
}
