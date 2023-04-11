import type { Circle, CircleMarker, Polygon, Polyline, Rectangle } from 'leaflet';
import type { Writable } from 'svelte/store';

export const polylineCtx = Symbol('Polyline');
export type PolylineContext = Writable<Polyline | undefined>;

export const polygonCtx = Symbol('Polygon');
export type PolygonContext = Writable<Polygon | undefined>;

export const circleCtx = Symbol('Circle');
export type CircleContext = Writable<Circle | undefined>;

export const circleMarkerCtx = Symbol('CircleMarker');
export type CircleMarkerContext = Writable<CircleMarker | undefined>;

export const rectangleCtx = Symbol('Rectangle');
export type RectangleContext = Writable<Rectangle | undefined>;
