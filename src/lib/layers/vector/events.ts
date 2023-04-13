import type { DivOverlayEvents, InteractiveLayerEvents } from '../events';

export interface CircleEvents extends InteractiveLayerEvents {}
export interface CircleMarkerEvents extends InteractiveLayerEvents {}
export interface GeoJSONEvents extends InteractiveLayerEvents {}
export interface PolygonEvents extends InteractiveLayerEvents {}
export interface PolylineEvents extends InteractiveLayerEvents {}
export interface RectangleEvents extends InteractiveLayerEvents {}
export interface SVGOverlayEvents extends DivOverlayEvents {}
