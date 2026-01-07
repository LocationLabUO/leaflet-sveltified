<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { setupEvents } from '$lib/util/events.js';
	import { getParentContext } from '$lib/util/parent.js';
	import { untrack } from 'svelte';
	import { setPathContext } from '../Path.svelte.js';
	import { setRectangleContext } from './Rectangle.svelte.js';

	const { getParentValue } = getParentContext();
	const context = setRectangleContext();
	const pathContext = setPathContext();
	const layerContext = setLayerContext();

	/**
	 * @type {import('./Rectangle.d.ts').RectangleProps}
	 */
	let { bounds, options, events, children } = $props();

	// Initialization effect - only depends on parent
	// Props are read with untrack since they're only used at creation time
	// (reactive updates are handled by separate effects below)
	$effect(() => {
		const parent = getParentValue();

		if (!parent) return;

		(async () => {
			const L = await import('leaflet');
			// Read props inside untrack to avoid re-running effect when object references change
			const currentBounds = untrack(() => bounds);
			const currentOptions = untrack(() => options);
			context.rectangle = L.rectangle(currentBounds, currentOptions);
			layerContext.layer = context.rectangle;
			pathContext.path = context.rectangle;
			context.rectangle.addTo(parent);
		})();

		return () => {
			context.rectangle?.remove();
			context.rectangle = undefined;
		};
	});

	// Reactive updates
	$effect(() => {
		context.rectangle?.setBounds(bounds);
	});

	$effect(() => {
		context.rectangle?.setStyle({ ...options });
	});

	// Events effect
	$effect(() => {
		if (!context.rectangle) return;
		return setupEvents(context.rectangle, events);
	});
</script>

{#if context.rectangle}
	{@render children?.()}
{/if}

