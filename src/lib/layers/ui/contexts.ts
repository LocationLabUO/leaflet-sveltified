import type { CircleMarker, DivOverlay, Marker, Popup, Tooltip } from 'leaflet';
import type { Writable } from 'svelte/store';

export const markerCtx = Symbol('Marker');
export type MarkerContext = Writable<Marker | undefined>;

export const circleMarkerCtx = Symbol('CircleMarker');
export type CircleMarkerContenxt = Writable<CircleMarker | undefined>;

export const divOverlayCtx = Symbol('DivOverlay');
export type DivOverlayContext = Writable<DivOverlay | undefined>;

export const tooltipCtx = Symbol('Tooltip');
export type TooltipContext = Writable<Tooltip | undefined>;

export const popupCtx = Symbol('Popup');
export type PopupContext = Writable<Popup | undefined>;
