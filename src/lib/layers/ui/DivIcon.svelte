<script lang="ts">
	import { getContext, onMount, tick } from 'svelte';
	import { markerCtx, type MarkerContext } from './contexts';

	const { getMarker } = getContext<MarkerContext>(markerCtx) || {};

	export let options: L.DivIconOptions = {};

	let icon: L.DivIcon;
	let marker: L.Marker;
	let content: HTMLElement;

	onMount(async () => {
		marker = await getMarker();
		const L = await import('leaflet');
		console.log(content.innerHTML);
		await tick();
		const className = options.className ? options.className : 'empty-no-styles';
		icon = L.divIcon({ html: content.innerHTML, ...options, className });
		marker.setIcon(icon);
	});

	// function initialize(element: HTMLElement) {
	// 	icon = L.divIcon({ html: element.innerHTML, ...options });
	// 	marker.setIcon(icon);
	// 	return {
	// 		destroy: () => {}
	// 	};
	// }

	export function getIcon() {
		return icon;
	}
</script>

<!-- <div style="display: none;">
  <div bind:this={html}>
    <slot />
  </div>
</div> -->

{#if marker && !icon}
	<div bind:this={content} style="display: none;">
		<slot />
	</div>
{/if}
