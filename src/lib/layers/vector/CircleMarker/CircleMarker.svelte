<script>
	import { untrack } from 'svelte';
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { setupEvents } from '$lib/util/events.js';
	import { getParentContext } from '$lib/util/parent.js';
	import { setPathContext } from '../Path.svelte.js';
	import { setCircleMarkerContext } from './CircleMarker.svelte.js';

	const { getParentValue } = getParentContext();
	const context = setCircleMarkerContext();
	const pathContext = setPathContext();
	const layerContext = setLayerContext();

	/**
	 * @type {import('./CircleMarker.d.ts').CircleMarkerProps}
	 */
	let { latlng, options, events, children } = $props();

	// Initialization effect - only depends on parent
	// Props are read with untrack since they're only used at creation time
	// (reactive updates are handled by separate effects below)
	$effect(() => {
		const parent = getParentValue();

		if (!parent) return;

		(async () => {
			const L = await import('leaflet');
			// Read props inside untrack to avoid re-running effect when object references change
			const currentLatlng = untrack(() => latlng);
			const currentOptions = untrack(() => options);
			context.circleMarker = L.circleMarker(currentLatlng, currentOptions);
			layerContext.layer = context.circleMarker;
			pathContext.path = context.circleMarker;
			context.circleMarker.addTo(parent);
		})();

		return () => {
			context.circleMarker?.remove();
			context.circleMarker = undefined;
		};
	});

	// Reactive updates
	$effect(() => {
		context.circleMarker?.setLatLng(latlng);
	});

	$effect(() => {
		context.circleMarker?.setRadius(options?.radius);
	});

	$effect(() => {
		context.circleMarker?.setStyle({ ...options });
	});

	// Events effect
	$effect(() => {
		if (!context.circleMarker) return;
		return setupEvents(context.circleMarker, events);
	});
</script>

{#if context.circleMarker}
	{@render children?.()}
{/if}

