<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { setupEvents } from '$lib/util/events.js';
	import { getParentContext } from '$lib/util/parent.js';
	import { untrack } from 'svelte';
	import { setPathContext } from '../Path.svelte.js';
	import { setCircleContext } from './Circle.svelte.js';

	const { getParentValue } = getParentContext();
	const context = setCircleContext();
	const pathContext = setPathContext();
	const layerContext = setLayerContext();

	/**
	 * @type {import('./Circle.d.ts').CircleProps}
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
			context.circle = L.circle(currentLatlng, currentOptions);
			layerContext.layer = context.circle;
			pathContext.path = context.circle;
			context.circle.addTo(parent);
		})();

		return () => {
			context.circle?.remove();
			context.circle = undefined;
		};
	});

	// Reactive updates
	$effect(() => {
		context.circle?.setLatLng(latlng);
	});

	$effect(() => {
		context.circle?.setRadius(options?.radius);
	});

	$effect(() => {
		context.circle?.setStyle({ ...options });
	});

	// Events effect
	$effect(() => {
		if (!context.circle) return;
		return setupEvents(context.circle, events);
	});
</script>

{#if context.circle}
	{@render children?.()}
{/if}
