import type {
	LeafletEventHandlerFn,
	LeafletMouseEventHandlerFn,
	PopupEventHandlerFn,
	TileEventHandlerFn,
	TooltipEventHandlerFn
} from 'leaflet';

export interface PopupEventsHandlers {
	popupopen?: PopupEventHandlerFn | undefined;
	popupclose?: PopupEventHandlerFn | undefined;
}

export interface TooltipEventHandlers {
	tooltipopen?: TooltipEventHandlerFn | undefined;
	tooltipclose?: TooltipEventHandlerFn | undefined;
}
export interface LayerEventHandlers extends PopupEventsHandlers, TooltipEventHandlers {
	add?: LeafletEventHandlerFn;
	remove?: LeafletEventHandlerFn;
}
export interface InteractiveLayerEventHandlers extends LayerEventHandlers {
	click?: LeafletMouseEventHandlerFn | undefined;
	dblclick?: LeafletMouseEventHandlerFn | undefined;
	mousedown?: LeafletMouseEventHandlerFn | undefined;
	mouseup?: LeafletMouseEventHandlerFn | undefined;
	mouseover?: LeafletMouseEventHandlerFn | undefined;
	mouseout?: LeafletMouseEventHandlerFn | undefined;
	contextmenu?: LeafletMouseEventHandlerFn | undefined;
}

export interface DivOverlayHandlers extends InteractiveLayerEventHandlers {
	contentupdate?: LeafletEventHandlerFn | undefined;
}

export interface GridLayerEventHandlers extends LayerEventHandlers {
	loading?: TileEventHandlerFn | undefined;
	tileunload?: TileEventHandlerFn | undefined;
	tileloadstart?: TileEventHandlerFn | undefined;
	tileerror?: TileEventHandlerFn | undefined;
	tileload?: TileEventHandlerFn | undefined;
	load?: TileEventHandlerFn | undefined;
}
