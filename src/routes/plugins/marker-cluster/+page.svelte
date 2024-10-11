<script lang="ts">
	import { DivIcon, Icon, LeafletMap, Marker, Popup, TileLayer } from '$lib/index.js';
	import MarkerCluster from '$lib/plugins/MarkerCluster/MarkerCluster.svelte';

	import type { LatLngExpression } from 'leaflet';

	let color = $state('#000000');
	let radius = $state(1000);
	let opacity = $state(1);

	function randomIntFromInterval(min, max) {
		// min and max included
		return Math.random() * (max - min + 1) + min;
	}

	let latlngs: LatLngExpression[] = $state([]);

	let currentLine = $state(0);
	let polyLineLatlngs: LatLngExpression[][] = $state([]);
</script>

<LeafletMap options={{ center: [0, 0], zoom: 2, maxZoom: 10 }}>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
	<MarkerCluster>
		{#each { length: 30 } as _, i}
			<Marker latlng={[randomIntFromInterval(24.5, 49), randomIntFromInterval(-125, -66.9)]}>
				<Popup>
					{i}
				</Popup>
				{#if i % 3 == 0}
					<Icon
						options={{
							iconUrl: `https://leafletjs.com/examples/custom-icons/leaf-green.png`,
							shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
							iconSize: [38, 95], // size of the icon
							shadowSize: [50, 64], // size of the shadow
							iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
							shadowAnchor: [4, 62], // the same for the shadow
							popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
						}}
					/>
				{/if}
				{#if i % 3 == 1}
					<DivIcon options={{}}>
						<div style="background-color: white; width: 50px; height: 50px;">
							{i}
						</div>
					</DivIcon>
				{/if}
			</Marker>
		{/each}
	</MarkerCluster>
</LeafletMap>

<div class="overlay"></div>

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
