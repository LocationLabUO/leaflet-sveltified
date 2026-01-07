<script>
	import { getMarkerContext } from '../Marker.svelte.js';

	const markerContext = getMarkerContext();
	if (!markerContext) throw Error('DivIcons must be nested under Markers');
	/**
	 * @type {import('./DivIcon.d.ts').DivIconProps}
	 */
	let {
		options = {
			html: ''
		},
		children
	} = $props();

	let shown = $state(true);

	// Read reactive dependencies synchronously before async work
	$effect(() => {
		const currentOptions = options;
		const marker = markerContext.marker;

		if (!marker) return;

		const onAdd = () => {
			shown = true;
		};
		const onRemove = () => {
			shown = false;
		};

		// Async work in IIFE so effect stays synchronous for proper cleanup
		(async () => {
			const L = await import('leaflet');
			marker.setIcon(
				L.divIcon({
					...currentOptions,
					html: currentOptions.html ? currentOptions.html : '',
					className: currentOptions.className ? currentOptions.className : ''
				})
			);
		})();

		marker.on('add', onAdd);
		marker.on('remove', onRemove);

		// Cleanup event listeners when effect re-runs or component unmounts
		return () => {
			marker.off('add', onAdd);
			marker.off('remove', onRemove);
		};
	});
</script>

<div bind:this={options.html}>
	{#if shown}
		{@render children?.()}
	{/if}
</div>
