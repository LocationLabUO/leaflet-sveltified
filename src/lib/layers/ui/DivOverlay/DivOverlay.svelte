<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { getMapContext } from '$lib/map/LeafletMap.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import { fade } from 'svelte/transition';
	import { DivOverlay, setDivOverlayContext } from './DivOverlay.svelte.js';

	/**
	 * @type {import('./DivOverlay.d.ts').DivOverlayProps}
	 */
	let { open = $bindable(false), latlng, options, events, children } = $props();

	const parent = getParent();
	const mapContext = getMapContext();
	const context = setDivOverlayContext();
	const layerCtx = setLayerContext();

	let content = $state(undefined);

	$effect(() => {});
	//onMount
	$effect(async () => {
		const L = await import('leaflet');
		if (latlng) {
			context.divOverlay = new DivOverlay(latlng, options);
		} else {
			context.divOverlay = new DivOverlay(options);
		}
		layerCtx.layer = context.divOverlay;
		context.divOverlay.on('add', () => {
			open = true;
		});
		context.divOverlay.on('remove', () => {
			open = false;
		});
	});

	$effect(() => {
		if (open) {
			if (!context.divOverlay?.isOpen()) {
				context.divOverlay?.openOn(mapContext.map);
			}
			context.divOverlay?.setContent(content);
		} else {
			if (context.divOverlay?.isOpen()) {
				context.divOverlay.close();
			}
		}
	});

	//events Effect
	$effect(() => {
		if (context.divOverlay) {
			for (const key in events) {
				if (context.divOverlay && events[key]) {
					context.divOverlay.on(key, events[key]);
				}
			}
			return () => {
				for (const key in events) {
					context.divOverlay?.off(key);
					//Re-add add and remove events
					if (key == 'add') {
						context.divOverlay.on('add', () => {
							open = true;
						});
					}
					if (key == 'remove') {
						context.divOverlay.on('remove', () => {
							open = false;
						});
					}
				}
			};
		}
	});

	$effect(() => {
		return () => {
			context.divOverlay.off('add');
			context.divOverlay.off('remove');
		};
	});

	$effect(() => {
		if (latlng) {
			context.divOverlay?.setLatLng(latlng);
		}
	});
</script>

<!-- svelte-ignore perf_avoid_nested_class -->
<!-- svelte-ignore perf_avoid_nested_class -->
{#if open}
	<div bind:this={content} out:fade>
		{@render children?.()}
	</div>
{/if}
