<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import { setPathContext } from '../Path.svelte.js';
	import { setPolygonContext } from './Polygon.svelte.js';

	const parent = getParent();
	const context = setPolygonContext();
	const pathContext = setPathContext();
	const layerContext = setLayerContext();
	//path context

	/**
	 * @type {import('./Polygon.d.ts').PolygonProps}
	 */
	let { latlngs, options, events, children } = $props();

	$effect(async () => {
		const L = await import('leaflet');
		context.polygon = L.polygon(latlngs, options);
		layerContext.layer = context.polygon;
		pathContext.path = context.polygon;
		context.polygon.addTo(parent);
	});

	$effect(() => {
		return () => {
			context.polygon?.remove();
		};
	});

	$effect(() => {
		context.polygon?.setLatLngs(latlngs);
	});

	$effect(() => {
		context.polygon?.setStyle({ ...options });
	});

	// Events Effect
	$effect(() => {
		for (const key in events) {
			if (context.polygon && events[key]) {
				context.polygon.on(key, events[key]);
			}
		}

		return () => {
			for (const key in events) {
				context.polygon?.off(key);
			}
		};
	});
</script>

{#if context.polygon}
	{@render children?.()}
{/if}
