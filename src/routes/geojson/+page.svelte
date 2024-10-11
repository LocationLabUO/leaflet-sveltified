<script lang="ts">
	import { GeoJSON, LeafletMap, TileLayer } from '$lib/index.js';
	const point: GeoJSON.Geometry = {
		type: 'Point',
		coordinates: [0, 0]
	};
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
	<GeoJSON data={point} />
</LeafletMap>

<div class="overlay">hi</div>

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
</style>
