// import type { Circle, CircleMarker, Polygon, Polyline, Rectangle } from 'leaflet';
// import type { Writable } from 'svelte/store';

import type { Evented } from 'leaflet';
import type { createEventDispatcher } from 'svelte';
import type { MarkerEvents } from '../layers';
import type { MapEvents } from '../map';
import type { MarkerClusterGroupEvents } from '../plugins';

type AllEvents = MarkerEvents & MapEvents & MarkerClusterGroupEvents;
type AnyEvent = Partial<AllEvents>;

export function updateListeners<T extends Evented>(
	element: T,
	events: (keyof AnyEvent)[],
	listeners: Set<keyof AnyEvent>,
	dispatch: ReturnType<typeof createEventDispatcher<AnyEvent>>
) {
	const newEvents = new Set(events);
	for (const l of listeners) {
		if (newEvents.has(l)) newEvents.delete(l);
		else {
			element.off(l);
			listeners.delete(l);
		}
	}
	for (const e of newEvents) {
		if (!listeners.has(e)) {
			element.on(e, (ev) => dispatch(e, ev));
			listeners.add(e);
		}
	}
}
