<script>
	import TileLayer from '$lib/layers/raster/TileLayer.svelte';
	import DivOverlay from '$lib/layers/ui/DivOverlay/DivOverlay.svelte';
	import LeafletMap from '$lib/map/LeafletMap.svelte';

	let open = $state(true);
	let lat = $state(0);
	let lng = $state(0);

	let latlng = $derived([lat, lng]);
	$inspect(latlng);
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />

	<DivOverlay bind:open {latlng} options={{}}>
		<div class="a">Hello World</div>
	</DivOverlay>
</LeafletMap>

<div class="overlay">
	<div>This one is a work ... in progress...</div>
	<label for="draggable">Open:</label>
	<input type="checkbox" bind:checked={open} />

	<div>
		<label for="lat">Lat:</label>
		<input type="range" bind:value={lat} max={90} min={-90} />
	</div>

	<div>
		<label for="lng">Lng:</label>
		<input type="range" bind:value={lng} max={180} min={-180} />
	</div>
</div>

<style>
	.a {
		background-color: white;
		width: 200px;
	}

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
</style>
