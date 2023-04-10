import type { LeafletEvent, LeafletMouseEvent, PopupEvent, TooltipEvent } from 'leaflet';

export interface LayerEvents {
	add: LeafletEvent;
	remove: LeafletEvent;
	//Popup Events
	popupopen: PopupEvent;
	popupclose: PopupEvent;
	//Tooltip Events
	tooltipopen: TooltipEvent;
	tooltipclose: TooltipEvent;
}

export interface InteractiveLayerEvents extends LayerEvents {
	click: LeafletMouseEvent;
	dblclick: LeafletMouseEvent;
	mousedown: LeafletMouseEvent;
	mouseup: LeafletMouseEvent;
	mouseover: LeafletMouseEvent;
	mouseout: LeafletMouseEvent;
	contextmenu: LeafletMouseEvent;
}

export interface RendererEvents extends LayerEvents {
	update: LeafletEvent;
}

export interface DivOverlayEvents extends InteractiveLayerEvents {
	contentupdate: LeafletEvent;
}

export interface ImageOverlayEvents extends InteractiveLayerEvents {
	load: LeafletEvent;
	error: LeafletEvent;
}
