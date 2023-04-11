import type { Control } from 'leaflet';
import type { Writable } from 'svelte/store';

export const controlCtx = Symbol('Control');
export type ControlContext = Writable<Control | undefined>;

export const layersControlCtx = Symbol('LayerControl');
export type LayersControlContext = Writable<Control.Layers | undefined>;

export const scaleControlCtx = Symbol('ScaleControl');
export type ScaleControlContext = Writable<Control.Scale | undefined>;
