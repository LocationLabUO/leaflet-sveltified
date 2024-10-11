import type { Control } from 'leaflet';

export interface AttributionControlProps {
	options?: Control.AttributionOptions;
	attributions?: string[];
}
