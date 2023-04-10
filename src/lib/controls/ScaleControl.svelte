<script lang="ts">
	import { mapCtx, type MapContext } from '$lib/map';
	import type { Control, ControlPosition } from 'leaflet';
	import { getContext, onDestroy, onMount, setContext, tick } from 'svelte';
	import { controlCtx, type ControlContext } from './contexts';

	export let position: ControlPosition = 'topright';
	export let options: Control.ScaleOptions = {};

	const { getMap } = getContext<MapContext>(mapCtx) || {};
	if (!getMap) throw Error('ScaleControl must be nested under a LeafletMap');

	setContext<ControlContext>(controlCtx, { getControl: getScaleControl });

	let scaleControl: L.Control.Scale;

	onMount(async () => {
		const L = await import('leaflet');
		scaleControl = L.control.scale(options).addTo(await getMap());
	});

	$: if (scaleControl) scaleControl.setPosition(position);

	onDestroy(() => {
		if (scaleControl) scaleControl.remove();
	});

	export async function getScaleControl() {
		while (!scaleControl) await tick();
		return scaleControl;
	}
</script>
