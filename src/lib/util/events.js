/**
 * Attaches Leaflet event handlers to a target and returns a cleanup function.
 * Use this inside $effect to properly manage event lifecycle.
 *
 * @example
 * $effect(() => {
 *   if (!context.marker) return;
 *   return setupEvents(context.marker, events);
 * });
 *
 * @param {import('leaflet').Evented} target - The Leaflet object to attach events to
 * @param {Record<string, Function | undefined>} [events] - Object mapping event names to handlers
 * @returns {() => void} Cleanup function that removes only the handlers that were added by this call
 */
export function setupEvents(target, events) {
	if (!target || !events) return () => {};

	// Track which handlers we add so we only remove those specific handlers
	// This preserves internal handlers (like onAdd/onRemove in Popup/Tooltip/DivOverlay)
	const handlers = [];
	for (const key in events) {
		if (events[key]) {
			target.on(key, events[key]);
			handlers.push({ key, handler: events[key] });
		}
	}

	return () => {
		for (const { key, handler } of handlers) {
			target?.off(key, handler);
		}
	};
}

