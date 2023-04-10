import type { DragEndEvent, LeafletEvent } from 'leaflet';
import type { InteractiveLayerEvents } from '../events';

export interface MarkerEvents extends InteractiveLayerEvents {
	//Dragging Events
	dragstart: LeafletEvent;
	movestart: LeafletEvent;
	drag: LeafletEvent;
	dragend: DragEndEvent;
	moveend: LeafletEvent;

	move: LeafletEvent;
}
