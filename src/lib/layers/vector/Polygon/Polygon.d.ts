import type {
	InteractiveLayerEventHandlers,
	LayerEventHandlers,
	PopupEventsHandlers,
	TooltipEventHandlers
} from '$lib/util/EventHandlers.js';
import type { LatLngExpression, PolylineOptions } from 'leaflet';
import type { Snippet } from 'svelte';

interface PolygonEventHandlers
	extends InteractiveLayerEventHandlers,
		LayerEventHandlers,
		PopupEventsHandlers,
		TooltipEventHandlers {}

export interface PolygonProps {
	latlngs: LatLngExpression[];
	options?: PolylineOptions;
	events?: PolygonEventHandlers;
	children?: Snippet;
}
