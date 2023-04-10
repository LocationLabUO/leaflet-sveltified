<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { markerCtx, type MarkerContext } from './contexts';

	const { getMarker } = getContext<MarkerContext>(markerCtx) || {};

	export let options: L.IconOptions | undefined = undefined;

	// let icon: L.Icon;
	onMount(async () => {
		const L = await import('leaflet');
		// icon = options ? L.icon(options) : new L.Icon.Default;
		(await getMarker()).setIcon(options ? L.icon(options) : new L.Icon.Default());
	});
</script>
