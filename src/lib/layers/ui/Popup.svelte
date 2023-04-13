<script lang="ts">
	import type { Popup, PopupOptions } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount, setContext, tick } from 'svelte';

	import {
		layerCtx,
		popupCtx,
		type DivOverlayEvents,
		type LayerContext,
		type PopupContext,
		type PopupEvents
	} from '$lib';
	import { updateListeners } from '$lib/util/helpers';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	export let options: PopupOptions = {};
	export let events: (keyof DivOverlayEvents)[] = [];
	const listeners = new Set<keyof PopupEvents>();

	const parent = getContext<LayerContext>(layerCtx) || undefined;
	const popup = writable<Popup | undefined>();

	let open = false;
	let content: HTMLElement;

	setContext<LayerContext>(layerCtx, popup);
	setContext<PopupContext>(popupCtx, popup);

	async function openPopup() {
		open = true;
		await tick();
		$popup?.setContent(content);
	}
	async function closePopup() {
		if ($popup) {
			open = false;
		}
	}

	const dispatch = createEventDispatcher();

	onMount(async () => {
		const L = await import('leaflet');
		$popup = L.popup(options);

		await tick();

		if ($parent?.getPopup()) {
			$parent.off('popupopen');
			$parent.off('popupclose');
			$parent.unbindPopup();
		}

		$parent?.on('popupopen', openPopup);
		$parent?.on('popupclose', closePopup);
		$parent?.bindPopup($popup);
	});

	$: if (events && $popup) updateListeners($popup, events, listeners, dispatch);

	onDestroy(() => {
		if ($parent) $parent.unbindPopup();
		$popup = undefined;
	});
</script>

{#if open}
	<div bind:this={content} out:fade>
		<slot />
	</div>
{/if}
