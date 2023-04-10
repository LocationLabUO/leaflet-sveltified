export const polylineCtx = Symbol('Polyline');
export type PolylineContext = {
	getPolyline: () => Promise<L.Polyline>;
};
export const polygonCtx = Symbol('Polygon');
export type PolygonContext = {
	getPolygon: () => Promise<L.Polygon>;
};
export const circleCtx = Symbol('Circle');
export type CircleContext = {
	getCircle: () => Promise<L.Circle>;
};
export const circleMarkerCtx = Symbol('CircleMarker');
export type CircleMarkerContext = {
	getCircleMarker: () => Promise<L.CircleMarker>;
};
export const rectangleCtx = Symbol('Rectangle');
export type RectangleContext = {
	getRectangle: () => Promise<L.Rectangle>;
};
