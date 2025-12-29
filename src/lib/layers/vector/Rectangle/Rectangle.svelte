<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import { setPathContext } from '../Path.svelte.js';
	import { setRectangleContext } from './Rectangle.svelte.js';

	let parent = getParent();
	const context = setRectangleContext();
	const pathContext = setPathContext();
	const layerContext = setLayerContext();
	//path context
	/**
	 * @type {import('./Rectangle.d.ts').RectangleProps}
	 */
	let { bounds, options, events, children } = $props();

	$effect(async () => {
		const L = await import('leaflet');
		context.rectangle = L.rectangle(bounds, options);
		layerContext.layer = context.rectangle;
		pathContext.path = context.rectangle;
		context.rectangle.addTo(parent);
	});

	$effect(() => {
		return () => {
			context.rectangle?.remove();
		};
	});

	$effect(() => {
		context.rectangle?.setBounds(bounds);
	});

	$effect(() => {
		context.rectangle?.setStyle({ ...options });
	});

	// Events Effect
	$effect(() => {
		for (const key in events) {
			if (context.rectangle && events[key]) {
				context.rectangle.on(key, events[key]);
			}
		}

		return () => {
			for (const key in events) {
				context.rectangle?.off(key);
			}
		};
	});
</script>

{#if context.rectangle}
	{@render children?.()}
{/if}

