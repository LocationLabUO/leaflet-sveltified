import type { Circle, CircleMarker, Polygon, Polyline, Popup, Rectangle } from 'leaflet';

// export const markerCtx = Symbol('Marker');
// export type MarkerContext = {
// 	getMarker: () => Promise<L.Marker>;
// };
export const polylineCtx = Symbol('Polyline');
export type PolylineContext = {
	getPolyline: () => Promise<Polyline>;
};
export const polygonCtx = Symbol('Polygon');
export type PolygonContext = {
	getPolygon: () => Promise<Polygon>;
};
export const circleCtx = Symbol('Circle');
export type CircleContext = {
	getCircle: () => Promise<Circle>;
};
export const circleMarkerCtx = Symbol('CircleMarker');
export type CircleMarkerContext = {
	getCircleMarker: () => Promise<CircleMarker>;
};
export const rectangleCtx = Symbol('Rectangle');
export type RectangleContext = {
	getRectangle: () => Promise<Rectangle>;
};
export const popupCtx = Symbol('Popup');
export type PopupContext = {
	getPopup: () => Promise<Popup>;
};
