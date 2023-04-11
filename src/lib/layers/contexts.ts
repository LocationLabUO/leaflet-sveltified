import type { FeatureGroup, Layer, LayerGroup } from 'leaflet';
import type { Writable } from 'svelte/store';

export const layerCtx = Symbol('Layer');
export type LayerContext = Writable<Layer | undefined>;

export const layerGroupCtx = Symbol('LayerGroup');
export type LayerGroupContext = Writable<LayerGroup | undefined>;

export const featureGroupCtx = Symbol('FeatureGroup');
export type FeatureGroupContext = Writable<FeatureGroup | undefined>;
