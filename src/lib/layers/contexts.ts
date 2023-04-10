export const layerCtx = Symbol('Layer');
export type LayerContext = {
	getLayer?: () => Promise<L.Layer>;
};

export const layerGroupCtx = Symbol('LayerGroup');
export type LayerGroupContext = {
	getLayerGroup?: () => Promise<L.LayerGroup>;
};

export const featureGroupCtx = Symbol('FeatureGroup');
export type FeatureGroupContext = {
	getFeatureGroup?: () => Promise<L.FeatureGroup>;
};
