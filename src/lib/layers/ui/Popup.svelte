<script lang="ts">
	import type { Layer, Popup, PopupOptions } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount, setContext, tick } from 'svelte';

	import {
		layerCtx,
		popupCtx,
		type DivOverlayEvents,
		type LayerContext,
		type PopupContext
	} from '$lib';
	import EventBridge from '$lib/util/EventBridge';
	import { fade } from 'svelte/transition';

	const { getLayer } = getContext<LayerContext>(layerCtx) || {};
	if (!getLayer) throw new Error('Popup must be nested inside a Layer');

	export let events: (keyof DivOverlayEvents)[] = [];
	export let options: PopupOptions = {};

	let popup: Popup;
	let parent: Layer;

	let open = false;
	let content: HTMLElement;

	export async function getPopup() {
		await tick();
		return popup;
	}

	setContext<LayerContext>(layerCtx, { getLayer: getPopup });
	setContext<PopupContext>(popupCtx, { getPopup });

	async function openPopup() {
		open = true;
		await tick();
		popup.setContent(content);
	}
	async function closePopup() {
		if (popup) {
			open = false;
		}
	}

	const dispatch = createEventDispatcher();
	let eventBridge: EventBridge<Popup>;

	onMount(async () => {
		const L = await import('leaflet');
		popup = L.popup(options);
		parent = await getLayer();

		if (parent.getPopup()) {
			parent.off('popupopen');
			parent.off('popupclose');
			parent.unbindPopup();
		}

		parent.on('popupopen', openPopup);
		parent.on('popupclose', closePopup);
		parent.bindPopup(popup);
		eventBridge = new EventBridge(popup, dispatch, events);
	});
	onDestroy(() => {
		if (parent) {
			parent.off('popupopen', openPopup);
			parent.off('popupclose', closePopup);
			parent.unbindPopup();
		}
		if (eventBridge) eventBridge.unregister();
	});
</script>

{#if open}
	<div bind:this={content} out:fade>
		<slot />
	</div>
{/if}
