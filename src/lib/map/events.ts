import type {
	LayerEvent,
	LayersControlEvent,
	LeafletEvent,
	LeafletKeyboardEvent,
	LeafletMouseEvent,
	PopupEvent,
	ResizeEvent,
	TooltipEvent,
	ZoomAnimEvent
} from 'leaflet';

//#region MapEvents
export interface MapEvents {
	//Layer Events
	baselayerchange: LayersControlEvent;
	overlayadd: LayersControlEvent;
	overlayremove: LayersControlEvent;
	layeradd: LayerEvent;
	layerremove: LayerEvent;
	//Map State Change Events
	zoomlevelschange: LeafletEvent;
	resize: ResizeEvent;
	unload: LeafletEvent;
	viewreset: LeafletEvent;
	load: LeafletEvent;
	zoomstart: LeafletEvent;
	movestart: LeafletEvent;
	zoom: LeafletEvent;
	move: LeafletEvent;
	zoomend: LeafletEvent;
	moveend: LeafletEvent;
	//Popup Events
	popupopen: PopupEvent;
	popupclose: PopupEvent;
	autopanstart: Event;
	//Tooltip Events
	tooltipopen: TooltipEvent;
	tooltipclose: TooltipEvent;
	//Interaction Events
	click: LeafletMouseEvent;
	dblclick: LeafletMouseEvent;
	mousedown: LeafletMouseEvent;
	mouseup: LeafletMouseEvent;
	mouseover: LeafletMouseEvent;
	mouseout: LeafletMouseEvent;
	mousemove: LeafletMouseEvent;
	contextmenu: LeafletMouseEvent;
	keypress: LeafletKeyboardEvent;
	keydown: LeafletKeyboardEvent;
	keyup: LeafletKeyboardEvent;
	preclick: LeafletMouseEvent;
	//Other Events
	zoomanim: ZoomAnimEvent;
	drag: LeafletEvent;
}
//#endregion
