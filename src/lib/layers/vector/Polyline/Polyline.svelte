<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import { setPathContext } from '../Path.svelte.js';
	import { setPolylineContext } from './Polyline.svelte.js';

	const parent = getParent();
	const context = setPolylineContext();
	const pathContext = setPathContext();
	const layerContext = setLayerContext();
	//path context

	/**
	 * @type {import('./Polyline.d.ts').PolylineProps}
	 */
	let { latlngs, options, events, children } = $props();

	$effect(async () => {
		const L = await import('leaflet');
		context.polyline = L.polyline(latlngs, options);
		layerContext.layer = context.polyline;
		pathContext.path = context.polyline;
		context.polyline.addTo(parent);
	});

	$effect(() => {
		return () => {
			context.polyline?.remove();
		};
	});

	$effect(() => {
		context.polyline?.setLatLngs(latlngs);
	});

	$effect(() => {
		context.polyline?.setStyle({ ...options });
	});

	// Events Effect
	$effect(() => {
		for (const key in events) {
			if (context.polyline && events[key]) {
				context.polyline.on(key, events[key]);
			}
		}

		return () => {
			for (const key in events) {
				context.polyline?.off(key);
			}
		};
	});
</script>

{#if context.polyline}
	{@render children?.()}
{/if}
