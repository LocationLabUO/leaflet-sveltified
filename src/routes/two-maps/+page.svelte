<script lang="ts">
	import LayerGroup from '$lib/layers/LayerGroup/LayerGroup.svelte';
	import TileLayer from '$lib/layers/raster/TileLayer.svelte';
	import LeafletMap from '$lib/map/LeafletMap.svelte';
	import type { MapOptions } from 'leaflet';

	let options: MapOptions = $state({ center: [0, 0], zoom: 3 });

	let map;

	$effect(() => {
		if (map.getMap()) {
			map.getMap().on('dragend', (e) => {
				console.log('drag on map 1 ended');
			});
		}
	});
</script>

<div class="map-grid">
	<div class="map-container">
		<LeafletMap
			bind:this={map}
			{options}
			events={{
				drag: (e) => {
					const view = e.target.getCenter();
					options.center = [view.lat, view.lng];
				},
				zoomend: (e) => {
					if (options.zoom !== e.target.getZoom()) {
						const view = e.target.getCenter();
						options.zoom = e.target.getZoom();
						options.center = [view.lat, view.lng];
					}
				}
			}}
		>
			<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
			<LayerGroup options={{}}></LayerGroup>
		</LeafletMap>
	</div>
	<div class="map-container">
		<LeafletMap
			{options}
			events={{
				drag: (e) => {
					const view = e.target.getCenter();
					options.center = [view.lat, view.lng];
				},
				zoomend: (e) => {
					if (options.zoom !== e.target.getZoom()) {
						const view = e.target.getCenter();
						options.zoom = e.target.getZoom();
						options.center = [view.lat, view.lng];
					}
				}
			}}
		>
			<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
			<LayerGroup options={{}}></LayerGroup>
		</LeafletMap>
	</div>
	<div class="map-container">
		<LeafletMap
			{options}
			events={{
				drag: (e) => {
					const view = e.target.getCenter();
					options.center = [view.lat, view.lng];
				},
				zoomend: (e) => {
					if (options.zoom !== e.target.getZoom()) {
						const view = e.target.getCenter();
						options.zoom = e.target.getZoom();
						options.center = [view.lat, view.lng];
					}
				}
			}}
		>
			<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
			<LayerGroup options={{}}></LayerGroup>
		</LeafletMap>
	</div>
	<div class="map-container">
		<LeafletMap
			{options}
			events={{
				drag: (e) => {
					const view = e.target.getCenter();
					options.center = [view.lat, view.lng];
				},
				zoomend: (e) => {
					if (options.zoom !== e.target.getZoom()) {
						const view = e.target.getCenter();
						options.zoom = e.target.getZoom();
						options.center = [view.lat, view.lng];
					}
				}
			}}
		>
			<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
			<LayerGroup options={{}}></LayerGroup>
		</LeafletMap>
	</div>
</div>
<div class="overlay">
	<div>
		View: {options.center[0].toString().substring(0, 7)}, {options.center[1]
			.toString()
			.substring(0, 7)}, {options.zoom}
	</div>
</div>

<style>
	.map-grid {
		width: 100%;
		display: flex;
		flex-wrap: wrap;

		gap: 10px;
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

	.map-container {
		width: 400px;
		height: 400px;
		margin-left: auto;
		margin-right: auto;
	}
</style>
