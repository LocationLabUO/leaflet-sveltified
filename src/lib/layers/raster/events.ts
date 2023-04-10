import type { LeafletEvent, TileErrorEvent, TileEvent } from 'leaflet';
import type { LayerEvents } from '../events';

//#region GridLayerEvents
export interface GridLayerEvents extends LayerEvents {
	loading: LeafletEvent;
	tileunload: TileEvent;
	tileloadstart: TileEvent;
	tileerror: TileErrorEvent;
	tileload: TileEvent;
	load: LeafletEvent;
}
export interface TileLayerEvents extends GridLayerEvents {
	tileabort: TileEvent;
}
