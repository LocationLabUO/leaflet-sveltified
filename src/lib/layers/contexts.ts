import type { FeatureGroup, Layer, LayerGroup } from 'leaflet';

export const layerCtx = Symbol('Layer');
export type LayerContext = {
	getLayer?: () => Promise<Layer>;
};

export const layerGroupCtx = Symbol('LayerGroup');
export type LayerGroupContext = {
	getLayerGroup?: () => Promise<LayerGroup>;
};

export const featureGroupCtx = Symbol('FeatureGroup');
export type FeatureGroupContext = {
	getFeatureGroup?: () => Promise<FeatureGroup>;
};
