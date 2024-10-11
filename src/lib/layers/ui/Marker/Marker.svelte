<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import { setMarkerContext } from './Marker.svelte.js';

	/**
	 * @type {import('./Marker.d.ts').MarkerProps}
	 */
	let { latlng, options, events, icon, children } = $props();

	const parent = getParent();

	const context = setMarkerContext();
	const layerContext = setLayerContext();

	//onMount
	$effect(async () => {
		const L = await import('leaflet');
		context.marker = L.marker(latlng, {
			...options,
			icon: icon
				? L.divIcon({ className: '' })
				: options?.icon
					? options.icon
					: new L.Icon.Default()
		});
		layerContext.layer = context.marker;
		context.marker.addTo(parent);
	});

	//onDestroy
	$effect(() => {
		return () => {
			if (context.marker) {
				context.marker.remove();
			}
		};
	});

	//Events Effect
	$effect(() => {
		if (context.marker) {
			for (const key in events) {
				if (context.marker && events[key]) {
					context.marker.on(key, events[key]);
				}
			}
			return () => {
				for (const key in events) {
					context.marker?.off(key);
				}
			};
		}
	});

	$effect(() => {
		context.marker?.setLatLng(latlng);
	});

	$effect(() => {
		context.marker?.setOpacity(options?.opacity);
	});

	$effect(() => {
		context.marker?.setZIndexOffset(options?.zIndexOffset);
	});

	$effect(() => {
		if (context.marker) {
			if (options?.draggable) {
				context.marker.dragging?.enable();
			} else {
				context.marker.dragging?.disable();
			}
		}
	});
</script>

{#if context.marker}
	{#if icon}
		{@render icon?.()}
	{/if}
	{@render children?.()}
{/if}
