<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import { setPathContext } from '../Path.svelte.js';
	import { setCircleMarkerContext } from './CircleMarker.svelte.js';

	let parent = getParent();
	const context = setCircleMarkerContext();
	const pathContext = setPathContext();
	const layerContext = setLayerContext();
	//path context
	/**
	 * @type {import('./CircleMarker.d.ts').CircleMarkerProps}
	 */
	let { latlng, options, events, children } = $props();

	$effect(async () => {
		const L = await import('leaflet');
		context.circleMarker = L.circleMarker(latlng, options);
		layerContext.layer = context.circleMarker;
		pathContext.path = context.circleMarker;
		context.circleMarker.addTo(parent);
	});

	$effect(() => {
		return () => {
			context.circleMarker?.remove();
		};
	});

	$effect(() => {
		context.circleMarker?.setLatLng(latlng);
	});

	$effect(() => {
		context.circleMarker?.setRadius(options?.radius);
	});

	$effect(() => {
		context.circleMarker?.setStyle({ ...options });
	});

	// Events Effect
	$effect(() => {
		for (const key in events) {
			if (context.circleMarker && events[key]) {
				context.circleMarker.on(key, events[key]);
			}
		}

		return () => {
			for (const key in events) {
				context.circleMarker?.off(key);
			}
		};
	});
</script>

{#if context.circleMarker}
	{@render children?.()}
{/if}

