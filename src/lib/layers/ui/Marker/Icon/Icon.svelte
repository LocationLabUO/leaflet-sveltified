<script>
	import { getMarkerContext } from '../Marker.svelte.js';

	const markerContext = getMarkerContext();
	if (!markerContext) throw Error('Icons must be nested under Markers');
	/**
	 * @type {import('./Icon.d.ts').IconProps}
	 */
	let { options } = $props();

	// Read reactive dependencies synchronously before async work
	$effect(() => {
		const currentOptions = options;
		const marker = markerContext.marker;

		if (!marker) return;

		// Async work in IIFE so effect stays synchronous for proper cleanup
		(async () => {
			const L = await import('leaflet');
			marker.setIcon(L.icon(currentOptions));
		})();
	});
</script>
