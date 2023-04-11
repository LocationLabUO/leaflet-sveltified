import type { DragEndEvent, LeafletEvent } from 'leaflet';
import type { DivOverlayEvents, InteractiveLayerEvents } from '../events';

export interface MarkerEvents extends InteractiveLayerEvents {
	//Dragging Events
	dragstart: LeafletEvent;
	movestart: LeafletEvent;
	drag: LeafletEvent;
	dragend: DragEndEvent;
	moveend: LeafletEvent;

	move: LeafletEvent;
}

export interface PopupEvents extends DivOverlayEvents {}
export interface TooltipEvents extends DivOverlayEvents {}
