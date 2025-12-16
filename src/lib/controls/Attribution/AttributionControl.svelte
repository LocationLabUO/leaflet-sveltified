<script>
	import { getMapContext } from '$lib/map/LeafletMap.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import { setControlContext } from '../Control.svelte.js';
	import { setAttributionControlContext } from './AttributionControl.svelte.js';

	/**
	 * @type {import('./AttributionControl.d.ts').AttributionControlProps}
	 */
	let { options, attributions } = $props();

	const parent = getParent();
	const mapContext = getMapContext();

	const controlCtx = setControlContext();
	const attributionControlCtx = setAttributionControlContext();

	$effect(async () => {
		const L = await import('leaflet');
		controlCtx.control = L.control.attribution(options);
		attributionControlCtx.attributionControl = controlCtx.control;
		controlCtx.control.addTo(mapContext.map);
	});

	$effect(() => {
		controlCtx.control?.setPosition(options.position);
	});

	$effect(() => {
		if (!attributions) return;
		let att = attributions;
		for (const attribution of att) {
			attributionControlCtx.attributionControl?.addAttribution(attribution);
		}
		return () => {
			if (!att) return;
			for (const attribution of att) {
				attributionControlCtx.attributionControl?.removeAttribution(attribution);
			}
		};
	});

	$effect(() => {
		return () => {
			controlCtx.control.remove();
		};
	});
</script>
