import type {
	InteractiveLayerEventHandlers,
	LayerEventHandlers,
	PopupEventsHandlers,
	TooltipEventHandlers
} from '$lib/util/EventHandlers.js';
import type {
	DragEndEventHandlerFn,
	LatLngExpression,
	LeafletEventHandlerFn,
	MarkerOptions
} from 'leaflet';
import type { Snippet } from 'svelte';

interface MarkerEventHandlers
	extends InteractiveLayerEventHandlers,
		LayerEventHandlers,
		PopupEventsHandlers,
		TooltipEventHandlers {
	move?: LeafletEventHandlerFn | undefined;

	//Dragging
	dragstart?: LeafletEventHandlerFn | undefined;
	movestart?: LeafletEventHandlerFn | undefined;
	drag?: LeafletEventHandlerFn | undefined;
	dragend?: DragEndEventHandlerFn | undefined;
	moveend?: LeafletEventHandlerFn | undefined;
}

export interface MarkerProps {
	latlng: LatLngExpression;
	options?: MarkerOptions;
	events?: MarkerEventHandlers;
	icon?: Snippet;
	children?: Snippet;
}
