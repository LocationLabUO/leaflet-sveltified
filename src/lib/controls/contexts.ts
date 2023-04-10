import type { Control } from 'leaflet';

export const controlCtx = Symbol('Control');
export type ControlContext = {
	getControl?: () => Promise<Control>;
};

export const layersControlCtx = Symbol('LayerControl');
export type LayersControlContext = {
	getLayersControl?: () => Promise<Control.Layers>;
};

export const scaleControlCtx = Symbol('ScaleControl');
export type ScaleControlContext = {
	getLayersControl?: () => Promise<Control.Layers>;
};
