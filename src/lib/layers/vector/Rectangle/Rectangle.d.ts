import type {
	InteractiveLayerEventHandlers,
	LayerEventHandlers,
	PopupEventsHandlers,
	TooltipEventHandlers
} from '$lib/util/EventHandlers.js';
import type { LatLngBoundsExpression, PolylineOptions } from 'leaflet';
import type { Snippet } from 'svelte';

interface RectangleEventHandlers
	extends InteractiveLayerEventHandlers,
		LayerEventHandlers,
		PopupEventsHandlers,
		TooltipEventHandlers {}

export interface RectangleProps {
	bounds: LatLngBoundsExpression;
	options?: PolylineOptions;
	events?: RectangleEventHandlers;
	children?: Snippet;
}

