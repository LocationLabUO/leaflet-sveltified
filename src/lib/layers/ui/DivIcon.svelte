<script lang="ts">
	import type { DivIcon, DivIconOptions } from 'leaflet';
	import { getContext, onMount, tick } from 'svelte';
	import { markerCtx, type MarkerContext } from './contexts';

	const marker = getContext<MarkerContext>(markerCtx);

	export let options: DivIconOptions = {};

	let icon: DivIcon;
	let content: HTMLElement;

	onMount(async () => {
		const L = await import('leaflet');

		const className = options.className ? options.className : 'empty-no-styles';

		await tick();
		icon = L.divIcon({ html: content, ...options, className });
		if ($marker) $marker.setIcon(icon);
	});

	export function getIcon() {
		return icon;
	}
</script>

<!-- {#if $marker} -->
<div bind:this={content}>
	<slot />
</div>
<!-- {/if} -->
