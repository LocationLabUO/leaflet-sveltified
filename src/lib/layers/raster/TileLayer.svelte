<script>
	import { getParent } from '$lib/util/parent.js';
	import { setLayerContext } from '../Layer.svelte.js';

	/**
	 * @type {import('./TileLayer.d.ts').TileLayerProps}
	 */
	let { url, options, events, children } = $props();

	const parent = getParent();
	const context = setLayerContext();

	//onMount
	$effect(async () => {
		const L = await import('leaflet');
		context.layer = new L.tileLayer(url, { ...options });
		context.layer.addTo(parent);
	});

	//onDestroy
	$effect(() => {
		return () => {
			context.layer?.removeFrom(parent);
		};
	});

	//Events Effect
	$effect(() => {
		if (context.layer) {
			for (const key in events) {
				if (context.layer && events[key]) {
					context.layer.on(key, events[key]);
				}
			}
			return () => {
				for (const key in events) {
					context.layer?.off(key);
				}
			};
		}
	});

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
