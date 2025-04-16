<script>
	import { setLayerContext } from '$lib/layers/Layer.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import { fade } from 'svelte/transition';
	import { setPopupContext } from './Popup.svelte.js';

	/**
	 * @type {import('./Popup.d.ts').PopupProps}
	 */
	let { open = $bindable(false), options, events, children } = $props();

	const parent = getParent();
	const context = setPopupContext();
	const layerCtx = setLayerContext();

	let content = $state(undefined);

	//onMount
	$effect(async () => {
		const L = await import('leaflet');
		context.popup = L.popup(options);
		layerCtx.layer = context.popup;
		context.popup.on('add', () => {
			open = true;
		});
		context.popup.on('remove', () => {
			open = false;
		});

		parent.bindPopup(context.popup);
	});

	$effect(() => {
		if (context.popup) {
			if (open) {
				if (!context.popup.isOpen()) {
					parent.openPopup();
				}
				context.popup.setContent(content);
			} else {
				if (context.popup?.isOpen()) {
					parent.closePopup();
				}
			}
		}
	});

	$effect(() => {
		return () => {
			context.popup.off('add');
			context.popup.off('remove');
			parent?.unbindPopup();
		};
	});

	//events Effect
	$effect(() => {
		if (context.popup) {
			for (const key in events) {
				if (context.popup && events[key]) {
					context.popup.on(key, events[key]);
				}
			}
			return () => {
				for (const key in events) {
					context.popup?.off(key);

					//Re-add add and remove events
					if (key == 'add') {
						context.popup.on('add', () => {
							open = true;
						});
					}
					if (key == 'remove') {
						context.popup.on('remove', () => {
							open = false;
						});
					}
				}
			};
		}
	});
</script>

{#if open}
	<div bind:this={content} out:fade>
		{@render children?.()}
	</div>
{/if}
