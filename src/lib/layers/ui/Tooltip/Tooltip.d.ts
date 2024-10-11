import type {
	DivOverlayHandlers,
	InteractiveLayerEventHandlers,
	LayerEventHandlers,
	PopupEventsHandlers,
	TooltipEventHandlers
} from '$lib/util/EventHandlers.js';
import type { TooltipOptions } from 'leaflet';
import type { Snippet } from 'svelte';

interface TooltipEventHandlers
	extends InteractiveLayerEventHandlers,
		LayerEventHandlers,
		PopupEventsHandlers,
		TooltipEventHandlers,
		DivOverlayHandlers {}

export interface TooltipProps {
	open?: boolean;
	options?: TooltipOptions;
	events?: PopupEventHandlers;
	children?: Snippet;
}
