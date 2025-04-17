<script>
	import { getMapContext } from '$lib/map/LeafletMap.svelte.js';
	import { getParent } from '$lib/util/parent.js';
	import { setControlContext } from './Control.svelte.js';

	/**
	 * @type {import('./Control.d.ts').ControlProps}
	 */
	let { options, children } = $props();

	/**
	 * @type {HTMLDivElement}
	 */
	let content = $state(undefined);

	const parent = getParent();
	const mapContext = getMapContext();

	const controlCtx = setControlContext();

	$effect(async () => {
		const L = await import('leaflet');
		controlCtx.control = new L.Control(options);
		controlCtx.control.addTo(mapContext.map);
	});

	$effect(() => {
		if (content && controlCtx.control) {
			controlCtx.control?.setPosition(options.position);
			controlCtx.control?.getContainer()?.appendChild(content);
		}
	});

	$effect(() => {
		return () => {
			controlCtx.control?.remove();
		};
	});

	$effect(() => {
		controlCtx.control?.getContainer()?.appendChild(content);

		return () => {
			// controlCtx.control?.getContainer()?.removeChild(content);
		};
	});
</script>

<div bind:this={content}>
	{@render children?.()}
</div>
