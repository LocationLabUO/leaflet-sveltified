<script lang="ts">
	import { controlCtx, mapCtx, type ControlContext, type MapContext } from '$lib';
	import type { Control, ControlOptions, ControlPosition } from 'leaflet';
	import { getContext, onDestroy, onMount, setContext, tick } from 'svelte';

	export let position: ControlPosition = 'topright';
	export let options: ControlOptions = {};

	const { getMap } = getContext<MapContext>(mapCtx) || {};
	if (!getMap) throw Error('Control Must be nested within a Map');

	setContext<ControlContext>(controlCtx, { getControl });

	let control: Control;

	onMount(async () => {
		const L = await import('leaflet');
		control = new L.Control(options).addTo(await getMap());
	});

	$: if (control) control.setPosition(position);

	onDestroy(() => {
		if (control) control.remove();
	});

	export async function getControl() {
		while (!control) await tick();
		return control;
	}
</script>
