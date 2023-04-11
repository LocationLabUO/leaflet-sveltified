<script lang="ts">
	import { getContext, onMount, tick } from 'svelte';
	import { markerCtx, type MarkerContext } from './contexts';

	const marker = getContext<MarkerContext>(markerCtx) || {};
	if (!marker) throw Error('Icons must be nested under Markers');

	export let options: L.IconOptions = {
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
		const L = await import('leaflet');
		// icon = options ? L.icon(options) : new L.Icon.Default;
		await tick();
		$marker?.setIcon(L.icon(options));
	});
</script>
