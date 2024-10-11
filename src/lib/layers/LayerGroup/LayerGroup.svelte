<script>
	import { getParent } from '../../util/parent.js';
	import { setLayerContext } from '../Layer.svelte.js';
	import { setLayerGroupContext } from './LayerGroups.svelte.js';

	/**
	 * @type {import('./LayerGroup.d.ts').LayerGroupProps}
	 */
	let { options, events, children } = $props();

	const parent = getParent();
	const context = setLayerGroupContext();
	const layerContext = setLayerContext();

	//onMount
	$effect(async () => {
		const L = await import('leaflet');
		context.layerGroup = L.layerGroup([], options);
		layerContext.layer = context.layerGroup;
		context.layerGroup.addTo(parent);
	});

	//onDestroy
	$effect(() => {
		return () => {
			if (context.layerGroup) {
				context.layerGroup.remove();
			}
		};
	});

	//Events Effect
	$effect(() => {
		for (const key in events) {
			if (context.layerGroup && events[key]) {
				context.layerGroup.on(key, events[key]);
			}
		}
		return () => {
			for (const key in events) {
				context.layerGroup?.off(key);
			}
		};
	});
</script>

{#if context.layerGroup}
	{@render children?.()}
{/if}
