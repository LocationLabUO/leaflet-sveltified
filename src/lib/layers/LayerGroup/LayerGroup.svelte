<script>
	import { untrack } from 'svelte';
	import { setupEvents } from '../../util/events.js';
	import { getParentContext } from '../../util/parent.js';
	import { setLayerContext } from '../Layer.svelte.js';
	import { setLayerGroupContext } from './LayerGroups.svelte.js';

	/**
	 * @type {import('./LayerGroup.d.ts').LayerGroupProps}
	 */
	let { options, events, children } = $props();

	const { getParentValue } = getParentContext();
	const context = setLayerGroupContext();
	const layerContext = setLayerContext();

	// Initialization effect - only depends on parent
	// Props are read with untrack since they're only used at creation time
	$effect(() => {
		const parent = getParentValue();

		if (!parent) return;

		(async () => {
			const L = await import('leaflet');
			// Read props inside untrack to avoid re-running effect when object references change
			const currentOptions = untrack(() => options);
			context.layerGroup = L.layerGroup([], currentOptions);
			layerContext.layer = context.layerGroup;
			context.layerGroup.addTo(parent);
		})();

		return () => {
			context.layerGroup?.remove();
			context.layerGroup = undefined;
		};
	});

	// Events effect
	$effect(() => {
		if (!context.layerGroup) return;
		return setupEvents(context.layerGroup, events);
	});
</script>

{#if context.layerGroup}
	{@render children?.()}
{/if}
