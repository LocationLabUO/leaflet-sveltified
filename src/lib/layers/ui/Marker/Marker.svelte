<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { setupEvents } from '$lib/util/events.js';
	import { getParentContext } from '$lib/util/parent.js';
	import { untrack } from 'svelte';
	import { setMarkerContext } from './Marker.svelte.js';

	/**
	 * @type {import('./Marker.d.ts').MarkerProps}
	 */
	let { latlng, options, events, icon, children } = $props();

	const { getParentValue } = getParentContext();

	const context = setMarkerContext();
	const layerContext = setLayerContext();

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
			const hasCustomIcon = untrack(() => !!icon);

			context.marker = L.marker(currentLatlng, {
				...currentOptions,
				icon: hasCustomIcon
					? L.divIcon({ className: '' })
					: currentOptions?.icon
						? currentOptions.icon
						: new L.Icon.Default()
			});
			layerContext.layer = context.marker;
			context.marker.addTo(parent);
		})();

		return () => {
			if (context.marker) {
				context.marker.remove();
				context.marker = undefined;
			}
		};
	});

	// Events effect
	$effect(() => {
		if (!context.marker) return;
		return setupEvents(context.marker, events);
	});

	// Reactive property updates
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
