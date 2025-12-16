import type {
	InteractiveLayerEventHandlers,
	LayerEventHandlers,
	PopupEventsHandlers,
	TooltipEventHandlers
} from '$lib/util/EventHandlers.js';
import type { CircleMarkerOptions, LatLngExpression, LeafletEventHandlerFn } from 'leaflet';
import type { Snippet } from 'svelte';

interface CircleMarkerEventHandlers
	extends InteractiveLayerEventHandlers,
		LayerEventHandlers,
		PopupEventsHandlers,
		TooltipEventHandlers {
	move?: LeafletEventHandlerFn | undefined;
}

export interface CircleMarkerProps {
	latlng: LatLngExpression;
	options?: CircleMarkerOptions;
	events?: CircleMarkerEventHandlers;
	children?: Snippet;
}

