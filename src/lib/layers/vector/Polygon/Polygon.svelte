<script>
	import { untrack } from 'svelte';
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { setupEvents } from '$lib/util/events.js';
	import { getParentContext } from '$lib/util/parent.js';
	import { setPathContext } from '../Path.svelte.js';
	import { setPolygonContext } from './Polygon.svelte.js';

	const { getParentValue } = getParentContext();
	const context = setPolygonContext();
	const pathContext = setPathContext();
	const layerContext = setLayerContext();

	/**
	 * @type {import('./Polygon.d.ts').PolygonProps}
	 */
	let { latlngs, options, events, children } = $props();

	// Initialization effect - only depends on parent
	// Props are read with untrack since they're only used at creation time
	// (reactive updates are handled by separate effects below)
	$effect(() => {
		const parent = getParentValue();

		if (!parent) return;

		(async () => {
			const L = await import('leaflet');
			// Read props inside untrack to avoid re-running effect when object references change
			const currentLatlngs = untrack(() => latlngs);
			const currentOptions = untrack(() => options);
			context.polygon = L.polygon(currentLatlngs, currentOptions);
			layerContext.layer = context.polygon;
			pathContext.path = context.polygon;
			context.polygon.addTo(parent);
		})();

		return () => {
			context.polygon?.remove();
			context.polygon = undefined;
		};
	});

	// Reactive updates
	$effect(() => {
		context.polygon?.setLatLngs(latlngs);
	});

	$effect(() => {
		context.polygon?.setStyle({ ...options });
	});

	// Events effect
	$effect(() => {
		if (!context.polygon) return;
		return setupEvents(context.polygon, events);
	});
</script>

{#if context.polygon}
	{@render children?.()}
{/if}
