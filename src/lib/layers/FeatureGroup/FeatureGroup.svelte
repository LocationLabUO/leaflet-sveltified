<script>
	import { untrack } from 'svelte';
	import { setupEvents } from '../../util/events.js';
	import { getParentContext } from '../../util/parent.js';
	import { setLayerContext } from '../Layer.svelte.js';
	import { setLayerGroupContext } from '../LayerGroup/LayerGroups.svelte.js';
	import { setFeatureGroupContext } from './FeatureGroup.svelte.js';

	/**
	 * @type {import('./FeatureGroup.d.ts').FeatureGroupProps}
	 */
	let { options, events, children } = $props();

	const { getParentValue } = getParentContext();
	const context = setFeatureGroupContext();
	const layerGroupContext = setLayerGroupContext();
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
			context.featureGroup = L.featureGroup([], currentOptions);
			layerGroupContext.layerGroup = context.featureGroup;
			layerContext.layer = context.featureGroup;
			context.featureGroup.addTo(parent);
		})();

		return () => {
			context.featureGroup?.remove();
			context.featureGroup = undefined;
		};
	});

	// Events effect
	$effect(() => {
		if (!context.featureGroup) return;
		return setupEvents(context.featureGroup, events);
	});
</script>

{#if context.featureGroup}
	{@render children?.()}
{/if}
