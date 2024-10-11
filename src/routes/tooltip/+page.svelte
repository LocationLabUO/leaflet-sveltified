<script lang="ts">
	import TileLayer from '$lib/layers/raster/TileLayer.svelte';
	import Marker from '$lib/layers/ui/Marker/Marker.svelte';
	import Tooltip from '$lib/layers/ui/Tooltip/Tooltip.svelte';
	import LeafletMap from '$lib/map/LeafletMap.svelte';

	let open = $state(false);
	let bindAdd = $state(false);
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
	<Marker latlng={[0, 0]}>
		<Tooltip
			bind:open
			options={{
				className: 'no-before',
				permanent: true
			}}
			events={{
				add: bindAdd
					? () => {
							console.log('added');
						}
					: undefined
			}}
		>
			<div>Bound Open state</div>
		</Tooltip>
	</Marker>
	<Marker latlng={[10, 10]}>
		<Tooltip
			options={{}}
			events={{
				add: bindAdd
					? () => {
							console.log('added');
						}
					: undefined
			}}
		>
			<div>Leaflet handles this one</div>
		</Tooltip>
	</Marker>
</LeafletMap>
<div class="overlay">
	<label for="open">Open State:</label>
	<input type="checkbox" bind:checked={open} />

	<label for="bindAdd">Bind Add:</label>
	<input type="checkbox" bind:checked={bindAdd} />
</div>

<style>
	.overlay {
		padding: 10px;
		background: white;
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 10000;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	:global(.no-before::before) {
		content: none;
	}
</style>
