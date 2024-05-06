<script lang="ts">
	import { mapCtx, type MapContext } from '$lib/map';
	import type { Control, ControlPosition } from 'leaflet';
	import { getContext, onDestroy, onMount, setContext, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { controlCtx, type ControlContext } from './contexts';

	export let position: ControlPosition = 'topright';
	export let options: Control.ScaleOptions = {};

	const map = getContext<MapContext>(mapCtx) || {};
	if (!$map) throw Error('ScaleControl must be nested under a LeafletMap');

	const scaleControl = writable<Control.Scale | undefined>();

	setContext<ControlContext>(controlCtx, scaleControl);

	onMount(async () => {
		$scaleControl = window.L.control.scale(options).addTo($map);
	});

	$: if ($scaleControl) $scaleControl.setPosition(position);

	onDestroy(() => {
		if ($scaleControl) $scaleControl.remove();
	});

	export async function getScaleControl() {
		while (!$scaleControl) await tick();
		return $scaleControl;
	}
</script>
