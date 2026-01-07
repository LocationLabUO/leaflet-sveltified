<script>
	import { untrack } from 'svelte';
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { setupEvents } from '$lib/util/events.js';
	import { getParentContext } from '$lib/util/parent.js';
	import { setPathContext } from '../Path.svelte.js';
	import { setPolylineContext } from './Polyline.svelte.js';

	const { getParentValue } = getParentContext();
	const context = setPolylineContext();
	const pathContext = setPathContext();
	const layerContext = setLayerContext();

	/**
	 * @type {import('./Polyline.d.ts').PolylineProps}
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
			context.polyline = L.polyline(currentLatlngs, currentOptions);
			layerContext.layer = context.polyline;
			pathContext.path = context.polyline;
			context.polyline.addTo(parent);
		})();

		return () => {
			context.polyline?.remove();
			context.polyline = undefined;
		};
	});

	// Reactive updates
	$effect(() => {
		context.polyline?.setLatLngs(latlngs);
	});

	$effect(() => {
		context.polyline?.setStyle({ ...options });
	});

	// Events effect
	$effect(() => {
		if (!context.polyline) return;
		return setupEvents(context.polyline, events);
	});
</script>

{#if context.polyline}
	{@render children?.()}
{/if}
