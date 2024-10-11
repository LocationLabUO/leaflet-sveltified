import type {
	InteractiveLayerEventHandlers,
	LayerEventHandlers,
	PopupEventsHandlers,
	TooltipEventHandlers
} from '$lib/util/EventHandlers.js';
import type { LatLngExpression, PolylineOptions } from 'leaflet';
import type { Snippet } from 'svelte';

interface PolylineEventHandlers
	extends InteractiveLayerEventHandlers,
		LayerEventHandlers,
		PopupEventsHandlers,
		TooltipEventHandlers {}

export interface PolylineProps {
	latlngs: LatLngExpression[] | LatLngExpression[][];
	options?: PolylineOptions;
	events?: PolylineEventHandlers;
	children?: Snippet;
}
