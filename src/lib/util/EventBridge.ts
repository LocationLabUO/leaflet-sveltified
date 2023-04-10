import type {
	Evented,
	LeafletEvent,
	LeafletEventHandlerFn,
	LeafletEventHandlerFnMap
} from 'leaflet';
import type { createEventDispatcher } from 'svelte';

export default class EventBridge<T extends Evented> {
	entity: T;
	eventHandlers: { event: string; handler: LeafletEventHandlerFn }[];
	constructor(
		entity: T,
		dispatch: ReturnType<typeof createEventDispatcher<{ [name: string]: LeafletEvent }>>,
		events: (keyof LeafletEventHandlerFnMap | 'contentupdate')[] = []
	) {
		this.entity = entity;

		this.eventHandlers = [];
		if (events) {
			const eventMap = new Map<string, any>();
			events.forEach((event) => {
				if (!eventMap.has(event)) {
					const handler = function (e: LeafletEvent) {
						dispatch(event, e);
					};
					this.eventHandlers.push({
						event: event,
						handler: handler
					});
					entity.on(event, handler);
					eventMap.set(event, handler);
				}
			});
		}
	}

	unregister() {
		this.eventHandlers.forEach((entry) => {
			this.entity.off(entry.event, entry.handler);
		});
	}
}
