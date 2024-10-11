<script>
	import { getMarkerContext } from '../Marker.svelte.js';

	const markerContext = getMarkerContext();
	if (!markerContext) throw Error('Icons must be nested under Markers');
	/**
	 * @type {import('./Icon.d.ts').IconProps}
	 */
	let { options } = $props();

	$effect(() => {
		markerContext.marker?.setIcon(L.icon(options));
	});
</script>
