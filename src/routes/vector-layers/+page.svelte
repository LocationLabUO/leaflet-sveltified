<script lang="ts">
	import { Circle, LeafletMap, Polygon, Polyline, Popup, TileLayer } from '$lib/index.js';

	import type { LatLngExpression } from 'leaflet';

	let color = $state('#000000');
	let radius = $state(1000);
	let opacity = $state(1);

	function randomIntFromInterval(min, max) {
		return Math.random() * (max - min + 1) + min;
	}

	let latlngs: LatLngExpression[] = $state([]);

	let currentLine = $state(0);
	let polyLineLatlngs: LatLngExpression[][] = $state([]);
</script>

<LeafletMap options={{ center: [0, 0], zoom: 2, maxZoom: 10 }}>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
	<Circle
		latlng={[10, 10]}
		options={{ radius: radius, color: color, fillColor: color, opacity, fillOpacity: opacity }}
		events={{ click: () => console.log('c') }}
	>
		<Popup>
			<span>Radius {radius}</span>
		</Popup>
	</Circle>

	<Polygon {latlngs} options={{ color: color, fillColor: color, opacity, fillOpacity: opacity }}>
		<Popup>
			{#each latlngs as latlng, i}
				<div>
					{i}. Lat: {latlng[1]},
					<div style="padding-left: 16px;">
						Lng: {latlng[0]}
					</div>
				</div>
			{/each}
		</Popup>
	</Polygon>
	<Polyline
		latlngs={polyLineLatlngs}
		options={{ color: color, fillColor: color, opacity, fillOpacity: opacity }}
	>
		<Popup>
			{polyLineLatlngs.length} segments
			{#each polyLineLatlngs as latlngs, i}
				<div>
					{i}. {latlngs.length} points
				</div>
			{/each}
		</Popup>
	</Polyline>
</LeafletMap>

<div class="overlay">
	<label for="radius">Opacity:</label>
	<input type="range" min="0" max="1" step="0.001" bind:value={opacity} />
	<label for="color">Color:</label>
	<!-- TODO: Change this to color picker when https://github.com/sveltejs/kit/issues/12798 is fixed -->
	<input type="text" bind:value={color} />
	<div>
		Circle:
		<label for="radius">Radius:</label>
		<input type="range" min="100" max="4000000" bind:value={radius} />
	</div>
	<div>
		Polygon:
		<button
			onclick={() => {
				latlngs.push([randomIntFromInterval(24.5, 49), randomIntFromInterval(-125, -66.9)]);
			}}>Add point to USA polygon</button
		>
		<button onclick={() => (latlngs = [])}> Clear </button>
	</div>
	<div>
		Polyline:
		<button
			onclick={() => {
				if (polyLineLatlngs.length < currentLine + 1) {
					polyLineLatlngs.push([]);
				}
				polyLineLatlngs[currentLine].push([
					randomIntFromInterval(-43.6, 10.6),
					randomIntFromInterval(113.2, 153.6)
				]);
			}}>Add point to AUS polyline</button
		>
		<button onclick={() => currentLine++}> FInish segment</button>
		<button onclick={() => (polyLineLatlngs = [])}> Clear </button>
	</div>
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
</style>
