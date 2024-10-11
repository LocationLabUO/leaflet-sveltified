import type { ControlOptions } from 'leaflet';
import type { Snippet } from 'svelte';

export interface ControlProps {
	options?: ControlOptions;
	children?: Snippet;
}
