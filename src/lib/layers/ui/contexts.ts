import type { Marker } from 'leaflet';

export const markerCtx = Symbol('Marker');
export type MarkerContext = {
	getMarker: () => Promise<Marker>;
};

export const tooltipCtx = Symbol('Tooltip');
export type TooltipContext = {
	getTooltip: () => Promise<L.Tooltip>;
};
export const popupCtx = Symbol('Popup');
export type PopupContext = {
	getPopup: () => Promise<L.Popup>;
};
