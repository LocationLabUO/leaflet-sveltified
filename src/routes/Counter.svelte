<script lang="ts">
	import { getLayerContext } from '$lib/layers/Layer.svelte.js';
	import { getPopupContext } from '$lib/layers/ui/Popup/Popup.svelte.js';

	let { popup = false } = $props();

	let count = $state(0);
	let layerContext = getLayerContext();

	let popupContext: {
		popup: import('leaflet').Popup;
	};
	if (popup) {
		popupContext = getPopupContext();
	}
</script>

<div>
	<div>{count}</div>
	<button onclick={() => count++}>+</button>
	<button onclick={() => count--}>-</button>
	<button onclick={() => (count = 0)}>Reset</button>
</div>

{#if popup}
	<div>
		<button
			onclick={() => {
				popupContext.popup.toggle();
			}}>Close Popup</button
		>
	</div>
{/if}
