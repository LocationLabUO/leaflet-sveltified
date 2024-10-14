<script>
	/**
	 * @type {import('./LeafletMap.d.ts').LeafletMapProps}
	 */
	let { options, map, children, events } = $props();
	import 'leaflet/dist/leaflet.css';
	import { setMapContext } from './LeafletMap.svelte.js';

	/**
	 * @type {HTMLDivElement}
	 */
	let mapdiv = $state();

	let context = setMapContext();

	export const getMap = () => {
		return context.map;
	};

	$effect(() => {
		return () => {
			context.map?.remove();
		};
	});
	$effect(async () => {
		if (mapdiv) {
			const L = await import('leaflet');
			context.map = L.map(mapdiv, options);
			map = context.map;
			context.map.on('resize', () => {
				context.map.invalidateSize();
			});
		}
	});

	//Events Effect
	$effect(() => {
		for (const key in events) {
			if (context.map && events[key]) {
				context.map.on(key, events[key]);
			}
		}
		return () => {
			for (const key in events) {
				context.map?.off(key);
			}
		};
	});

	$effect(() => {
		if (options.zoom !== context.map?.getZoom()) {
			context.map?.setZoom(options.zoom);
		}
	});
	$effect(() => {
		context.map?.setView(options.center, options.zoom);
	});
</script>

<div style="width:100%; height:100%" bind:this={mapdiv}>
	{#if mapdiv && context.map}
		{@render children?.()}
	{/if}
</div>
