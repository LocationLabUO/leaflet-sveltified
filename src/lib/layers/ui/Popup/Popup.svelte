<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { setupEvents } from '$lib/util/events.js';
	import { getParentContext } from '$lib/util/parent.js';
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import { setPopupContext } from './Popup.svelte.js';

	/**
	 * @type {import('./Popup.d.ts').PopupProps}
	 */
	let { open = $bindable(false), options, events, children } = $props();

	const { getParentValue } = getParentContext();
	const context = setPopupContext();
	const layerCtx = setLayerContext();

	let content = $state(undefined);

	// Internal event handlers for syncing open state
	const onAdd = () => {
		open = true;
	};
	const onRemove = () => {
		open = false;
	};

	// Initialization effect - only depends on parent, not options
	// Options are read with untrack since they're only used at creation time
	$effect(() => {
		const parent = getParentValue();

		if (!parent) return;

		(async () => {
			const L = await import('leaflet');
			// Read options inside untrack to avoid re-running effect when options object reference changes
			const currentOptions = untrack(() => options);
			context.popup = L.popup(currentOptions);
			layerCtx.layer = context.popup;

			context.popup.on('add', onAdd);
			context.popup.on('remove', onRemove);

			parent.bindPopup(context.popup);
		})();

		return () => {
			context.popup?.off('add', onAdd);
			context.popup?.off('remove', onRemove);
			parent?.unbindPopup();
			context.popup = undefined;
		};
	});

	// Open/close state effect
	$effect(() => {
		const popup = context.popup;
		const parent = getParentValue();
		const currentContent = content;

		if (!popup || !parent) return;

		if (open) {
			if (!popup.isOpen()) {
				parent.openPopup();
			}
			popup.setContent(currentContent);
		} else {
			if (popup.isOpen()) {
				parent.closePopup();
			}
		}
	});

	// User events effect
	$effect(() => {
		if (!context.popup) return;
		return setupEvents(context.popup, events);
	});
</script>

{#if open}
	<div bind:this={content} out:fade>
		{@render children?.()}
	</div>
{/if}
