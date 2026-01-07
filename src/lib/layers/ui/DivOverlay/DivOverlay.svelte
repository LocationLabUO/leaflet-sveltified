<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { getMapContext } from '$lib/map/LeafletMap.svelte.js';
	import { setupEvents } from '$lib/util/events.js';
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import { DivOverlay, setDivOverlayContext } from './DivOverlay.svelte.js';

	/**
	 * @type {import('./DivOverlay.d.ts').DivOverlayProps}
	 */
	let { open = $bindable(false), latlng, options, events, children } = $props();

	const mapContext = getMapContext();
	const context = setDivOverlayContext();
	const layerCtx = setLayerContext();

	let content = $state(undefined);

	// Internal event handlers for syncing open state
	const onAdd = () => {
		open = true;
	};
	const onRemove = () => {
		open = false;
	};

	// Initialization effect - only depends on map, not options/latlng
	// Options and latlng are read with untrack since they're only used at creation time
	// (latlng updates are handled by a separate reactive effect)
	$effect(() => {
		const map = mapContext?.map;

		if (!map) return;

		(async () => {
			// Read options/latlng inside untrack to avoid re-running effect when object references change
			const currentLatlng = untrack(() => latlng);
			const currentOptions = untrack(() => options);

			if (currentLatlng) {
				context.divOverlay = new DivOverlay(currentLatlng, currentOptions);
			} else {
				context.divOverlay = new DivOverlay(currentOptions);
			}
			layerCtx.layer = context.divOverlay;

			context.divOverlay.on('add', onAdd);
			context.divOverlay.on('remove', onRemove);
		})();

		return () => {
			context.divOverlay?.off('add', onAdd);
			context.divOverlay?.off('remove', onRemove);
			context.divOverlay = undefined;
		};
	});

	// Open/close state effect
	$effect(() => {
		const divOverlay = context.divOverlay;
		const map = mapContext?.map;
		const currentContent = content;

		if (!divOverlay || !map) return;

		if (open) {
			if (!divOverlay.isOpen()) {
				divOverlay.openOn(map);
			}
			divOverlay.setContent(currentContent);
		} else {
			if (divOverlay.isOpen()) {
				divOverlay.close();
			}
		}
	});

	// User events effect
	$effect(() => {
		if (!context.divOverlay) return;
		return setupEvents(context.divOverlay, events);
	});

	// Reactive latlng update
	$effect(() => {
		if (latlng) {
			context.divOverlay?.setLatLng(latlng);
		}
	});
</script>

<!-- svelte-ignore perf_avoid_nested_class -->
{#if open}
	<div bind:this={content} out:fade>
		{@render children?.()}
	</div>
{/if}
