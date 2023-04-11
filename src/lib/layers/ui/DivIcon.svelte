<script lang="ts">
	import { getContext, onMount, tick } from 'svelte';
	import { markerCtx, type MarkerContext } from './contexts';

	const marker = getContext<MarkerContext>(markerCtx);

	export let options: L.DivIconOptions = {};

	let icon: L.DivIcon;
	let content: HTMLElement;

	onMount(async () => {
		const L = await import('leaflet');

		const className = options.className ? options.className : 'empty-no-styles';
		icon = L.divIcon({ html: content.innerHTML, ...options, className });

		await tick();
		if ($marker) $marker.setIcon(icon);
	});

	export function getIcon() {
		return icon;
	}
</script>

{#if $marker && !icon}
	<div bind:this={content} style="display: none;">
		<slot />
	</div>
{/if}
