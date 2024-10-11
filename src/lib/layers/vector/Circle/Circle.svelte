<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import { setPathContext } from '../Path.svelte.js';
	import { setCircleContext } from './Circle.svelte.js';

	let parent = getParent();
	const context = setCircleContext();
	const pathContext = setPathContext();
	const layerContext = setLayerContext();
	//path context
	/**
	 * @type {import('./Circle.d.ts').CircleProps}
	 */
	let { latlng, options, events, children } = $props();

	$effect(async () => {
		const L = await import('leaflet');
		context.circle = L.circle(latlng, options);
		layerContext.layer = context.circle;
		pathContext.path = context.circle;
		context.circle.addTo(parent);
	});

	$effect(() => {
		return () => {
			context.circle?.remove();
		};
	});

	$effect(() => {
		context.circle?.setLatLng(latlng);
	});

	$effect(() => {
		context.circle?.setRadius(options?.radius);
	});

	$effect(() => {
		context.circle?.setStyle({ ...options });
	});

	// Events Effect
	$effect(() => {
		for (const key in events) {
			if (context.circle && events[key]) {
				context.circle.on(key, events[key]);
			}
		}

		return () => {
			for (const key in events) {
				context.circle?.off(key);
			}
		};
	});
</script>

{#if context.circle}
	{@render children?.()}
{/if}
