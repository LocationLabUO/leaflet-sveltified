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
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	const parent = getContext<LayerContext>(layerCtx);

	export let events: (keyof DivOverlayEvents)[] = [];
	export let options: PopupOptions = {};

	let popup = writable<Popup | undefined>();

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

	$: if (events) updateListeners();

	let listeners = new Set<keyof PopupEvents>();
	function updateListeners() {
		if (!$popup) return;
		const newEvents = new Set(events);
		for (const l of listeners) {
			if (newEvents.has(l)) newEvents.delete(l);
			else {
				$popup.off(l);
				listeners.delete(l);
			}
		}
		for (const e of newEvents) {
			if (!listeners.has(e)) {
				$popup.on(e, (ev) => dispatch(e, ev));
				listeners.add(e);
			}
		}
	}

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
