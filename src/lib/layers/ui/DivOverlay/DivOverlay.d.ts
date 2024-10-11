import type { DivOverlayHandlers } from '$lib/util/EventHandlers.js';
import type { DivOverlayOptions, LatLngExpression } from 'leaflet';
import type { Snippet } from 'svelte';

export interface DivOverlayProps {
	open?: boolean;
	latlng?: LatLngExpression;
	options?: DivOverlayOptions;
	events?: DivOverlayHandlers;
	children?: Snippet;
}
