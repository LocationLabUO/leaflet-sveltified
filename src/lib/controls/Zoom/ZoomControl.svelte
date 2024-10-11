<script>
	import { getMapContext } from '$lib/map/LeafletMap.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import { setControlContext } from '../Control.svelte.js';
	import { setZoomControlContext } from './ZoomControl.svelte.js';

	/**
	 * @type {import('./ZoomControl.d.ts').ZoomControlProps}
	 */
	let { options } = $props();

	const parent = getParent();
	const mapContext = getMapContext();

	const controlCtx = setControlContext();
	const zoomControlCtx = setZoomControlContext();

	$effect(async () => {
		const L = await import('leaflet');
		controlCtx.control = L.control.zoom(options);
		zoomControlCtx.zoomControl = controlCtx.control;
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
