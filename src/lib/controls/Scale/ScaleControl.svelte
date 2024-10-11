<script>
	import { getMapContext } from '$lib/map/LeafletMap.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import { setControlContext } from '../Control.svelte.js';
	import { setScaleControlContext } from './ScaleControl.svelte.js';

	/**
	 * @type {import('./ScaleControl.d.ts').ScaleControlProps}
	 */
	let { options } = $props();

	const parent = getParent();
	const mapContext = getMapContext();

	const controlCtx = setControlContext();
	const scaleControlCtx = setScaleControlContext();

	$effect(async () => {
		const L = await import('leaflet');
		controlCtx.control = L.control.scale(options);
		scaleControlCtx.scaleControl = controlCtx.control;
		controlCtx.control.addTo(mapContext.map);
	});

	$effect(() => {
		controlCtx.control?.setPosition(options.position);
	});

	$effect(() => {
		return () => {
			controlCtx.control.remove();
		};
	});
</script>
