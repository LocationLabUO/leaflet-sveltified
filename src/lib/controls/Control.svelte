<script lang="ts">
	import { controlCtx, mapCtx, type ControlContext, type MapContext } from '$lib';
	import type { Control, ControlOptions, ControlPosition } from 'leaflet';
	import { getContext, onDestroy, onMount, setContext, tick } from 'svelte';
	import { writable } from 'svelte/store';

	export let position: ControlPosition = 'topright';
	export let options: ControlOptions = {};

	const map = getContext<MapContext>(mapCtx) || undefined;
	if (!map) throw Error('Control Must be nested within a Map');

	let control = writable<Control | undefined>();
	setContext<ControlContext>(controlCtx, control);

	onMount(async () => {
		$control = new window.L.Control(options);
		if (!$map) await tick();
		if ($map) $control.addTo($map);
	});

	$: if ($control) $control.setPosition(position);

	onDestroy(() => {
		if ($map) $control?.remove();
		$control = undefined;
	});
</script>
