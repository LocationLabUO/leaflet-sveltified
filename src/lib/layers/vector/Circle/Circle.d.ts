import type {
	InteractiveLayerEventHandlers,
	LayerEventHandlers,
	PopupEventsHandlers,
	TooltipEventHandlers
} from '$lib/util/EventHandlers.js';
import type { CircleOptions, LatLngExpression, LeafletEventHandlerFn } from 'leaflet';
import type { Snippet } from 'svelte';

interface CircleEventHandlers
	extends InteractiveLayerEventHandlers,
		LayerEventHandlers,
		PopupEventsHandlers,
		TooltipEventHandlers {
	move?: LeafletEventHandlerFn | undefined;
}

export interface CircleProps {
	latlng: LatLngExpression;
	options?: CircleOptions;
	events?: CircleEventHandlers;
	children?: Snippet;
}
