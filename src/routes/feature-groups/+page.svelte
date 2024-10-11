<script lang="ts">
	import FeatureGroup from '$lib/layers/FeatureGroup/FeatureGroup.svelte';
	import TileLayer from '$lib/layers/raster/TileLayer.svelte';
	import Marker from '$lib/layers/ui/Marker/Marker.svelte';
	import LeafletMap from '$lib/map/LeafletMap.svelte';
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />

	<FeatureGroup
		events={{
			click: () => {
				console.log('clicked feature group 1');
			}
		}}
	>
		<Marker latlng={[10, 10]} />
		<Marker latlng={[20, 20]} />
	</FeatureGroup>

	<FeatureGroup
		events={{
			click: () => {
				console.log('clicked feature group 2');
			}
		}}
	>
		<Marker latlng={[-10, -10]} />
		<Marker latlng={[-20, -20]} />
	</FeatureGroup>
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
