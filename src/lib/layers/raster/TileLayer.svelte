<script>
	import { untrack } from 'svelte';
	import { setupEvents } from '$lib/util/events.js';
	import { getParentContext } from '$lib/util/parent.js';
	import { setLayerContext } from '../Layer.svelte.js';

	/**
	 * @type {import('./TileLayer.d.ts').TileLayerProps}
	 */
	let { url, options, events, children } = $props();

	const { getParentValue } = getParentContext();
	const context = setLayerContext();

	// Initialization effect - only depends on parent
	// Props are read with untrack since they're only used at creation time
	// (reactive updates are handled by separate effects below)
	$effect(() => {
		const parent = getParentValue();

		if (!parent) return;

		(async () => {
			const L = await import('leaflet');
			// Read props inside untrack to avoid re-running effect when object references change
			const currentUrl = untrack(() => url);
			const currentOptions = untrack(() => options);
			context.layer = new L.TileLayer(currentUrl, { ...currentOptions });
			context.layer.addTo(parent);
		})();

		return () => {
			context.layer?.remove();
			context.layer = undefined;
		};
	});

	// Events effect
	$effect(() => {
		if (!context.layer) return;
		return setupEvents(context.layer, events);
	});

	// Reactive updates
	$effect(() => {
		context.layer?.setUrl(url);
	});

	$effect(() => {
		context.layer?.setOpacity(options?.opacity);
	});

	$effect(() => {
		context.layer?.setZIndex(options?.zIndex);
	});
</script>

{#if context.layer}
	{@render children?.()}
{/if}
