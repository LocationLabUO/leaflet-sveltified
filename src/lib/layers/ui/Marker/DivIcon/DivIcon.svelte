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

	$effect(() => {
		const icon = markerContext.marker?.setIcon(
			L.divIcon({
				...options,
				html: options.html ? options.html : '',
				className: options.className ? options.className : ''
			})
		);
		icon.on('add', () => {
			shown = true;
		});
		icon.on('remove', () => {
			shown = false;
		});
	});
</script>

<div bind:this={options.html}>
	{#if shown}
		{@render children?.()}
	{/if}
</div>
