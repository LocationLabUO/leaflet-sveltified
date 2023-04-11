import type { FeatureGroupEvents } from '$lib';
import type { LeafletEvent, MarkerClusterSpiderfyEvent } from 'leaflet';

export interface MarkerClusterGroupEvents extends FeatureGroupEvents {
	spiderfied: MarkerClusterSpiderfyEvent;
	unspiderfied: MarkerClusterSpiderfyEvent;
	animationend: LeafletEvent;
}
