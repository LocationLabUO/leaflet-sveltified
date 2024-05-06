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
	import { writable } from 'svelte/store';

	export let position: ControlPosition = 'topright';
	export let options: Control.LayersOptions = {};

	const layersControl = writable<Control.Layers | undefined>();

	const map = getContext<MapContext>(mapCtx) || {};
	if (!$map) throw Error('LayersControl must be nested within a LeafletMap');

	setContext<ControlContext>(controlCtx, layersControl);
	setContext<LayersControlContext>(layersControlCtx, layersControl);

	onMount(async () => {
		$layersControl = window.L.control.layers(undefined, undefined, options).addTo($map);
	});

	onDestroy(() => {
		if ($layersControl) {
			$layersControl.remove();
		}
	});

	$: if ($layersControl) $layersControl.setPosition(position);

	export async function getLayersControl() {
		await tick();
		return $layersControl;
	}
</script>

{#if $layersControl}
	<slot />
{/if}
