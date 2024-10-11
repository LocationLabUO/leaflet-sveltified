<script>
	import { getParent } from '../../util/parent.js';
	import { setLayerContext } from '../Layer.svelte.js';
	import { setLayerGroupContext } from '../LayerGroup/LayerGroups.svelte.js';
	import { setFeatureGroupContext } from './FeatureGroup.svelte.js';

	/**
	 * @type {import('./FeatureGroup.d.ts').FeatureGroupProps}
	 */
	let { options, events, children } = $props();

	const parent = getParent();
	const context = setFeatureGroupContext();
	const layerGroupContext = setLayerGroupContext();
	const layerContext = setLayerContext();

	//onMount
	$effect(async () => {
		const L = await import('leaflet');
		context.featureGroup = L.featureGroup([], options);
		layerGroupContext.layerGroup = context.featureGroup;
		layerContext.layer = context.featureGroup;
		context.featureGroup.addTo(parent);
	});

	//onDestroy
	$effect(() => {
		return () => {
			if (context.featureGroup) {
				context.featureGroup.remove();
			}
		};
	});

	//Events Effect
	$effect(() => {
		for (const key in events) {
			if (context.featureGroup && events[key]) {
				context.featureGroup.on(key, events[key]);
			}
		}
		return () => {
			for (const key in events) {
				context.featureGroup?.off(key);
			}
		};
	});
</script>

{#if context.featureGroup}
	{@render children?.()}
{/if}
