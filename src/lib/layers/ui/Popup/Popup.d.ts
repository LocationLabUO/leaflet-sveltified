import type { DivOverlayHandlers, InteractiveLayerEventHandlers } from '$lib/util/EventHandlers.js';
import type { Snippet } from 'svelte';

interface PopupEventHandlers extends DivOverlayHandlers, InteractiveLayerEventHandlers {}

export interface PopupProps {
	open?: boolean;
	options?: PopupOptions;
	events?: PopupEventHandlers;
	children?: Snippet;
}
