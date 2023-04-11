<script lang="ts">
	import {
		controlCtx,
		layersControlCtx,
		mapCtx,
		type ControlContext,
		type LayersControlContext,
		type MapContext
	} from '$lib';
	import type { Control, ControlPosition } from 'leaflet';
	import { getContext, onDestroy, onMount, setContext, tick } from 'svelte';

	export let position: ControlPosition = 'topright';
	export let options: Control.LayersOptions = {};

	const { getMap } = getContext<MapContext>(mapCtx) || {};
	if (!getMap) throw Error('LayersControl must be nested within a LeafletMap');

	setContext<ControlContext>(controlCtx, { getControl: getLayersControl });
	setContext<LayersControlContext>(layersControlCtx, { getLayersControl });

	let layersControl: Control.Layers;

	onMount(async () => {
		const L = await import('leaflet');
		layersControl = L.control.layers(undefined, undefined, options).addTo(await getMap());
	});

	onDestroy(() => {
		layersControl.remove();
	});

	$: if (layersControl) layersControl.setPosition(position);

	export async function getLayersControl() {
		await tick();
		return layersControl;
	}
</script>

{#if layersControl}
	<slot />
{/if}
