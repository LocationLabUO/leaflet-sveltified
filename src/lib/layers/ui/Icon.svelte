<script lang="ts">
	import type { IconOptions } from 'leaflet';
	import { getContext, onMount, tick } from 'svelte';
	import { markerCtx, type MarkerContext } from './contexts';

	const marker = getContext<MarkerContext>(markerCtx) || {};
	if (!marker) throw Error('Icons must be nested under Markers');

	export let options: IconOptions = {
		iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
		iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
		shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
		shadowSize: [41, 41]
	};

	// let icon: L.Icon;
	onMount(async () => {
		// icon = options ? L.icon(options) : new L.Icon.Default;
		await tick();
		$marker?.setIcon(window.L.icon(options));
	});
</script>
