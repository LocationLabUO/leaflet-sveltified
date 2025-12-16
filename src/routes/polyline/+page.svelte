<script lang="ts">
	import { LeafletMap, Polyline, Popup, TileLayer } from '$lib/index.js';

	import type { LatLngExpression } from 'leaflet';

	let color = $state('#3388ff');
	let weight = $state(3);
	let opacity = $state(1);
	let fillOpacity = $state(0.2);

	// Example polyline paths
	const route1: LatLngExpression[] = [
		[40.7128, -74.006],
		[40.7589, -73.9851],
		[40.7489, -73.9681],
		[40.7282, -73.7949]
	];

	const route2: LatLngExpression[] = [
		[40.7128, -74.006],
		[40.7589, -73.9851],
		[40.7489, -73.9681]
	];

	const multiSegmentRoute: LatLngExpression[][] = [
		[
			[40.7128, -74.006],
			[40.7589, -73.9851]
		],
		[
			[40.7489, -73.9681],
			[40.7282, -73.7949]
		]
	];
</script>

<LeafletMap options={{ center: [40.73, -73.95], zoom: 11 }}>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
	<Polyline
		latlngs={route1}
		options={{
			color,
			weight,
			opacity,
			fillOpacity
		}}
		events={{
			click: () => {
				console.log('Polyline clicked!');
			}
		}}
	>
		<Popup>
			<div>
				<h3>Route 1</h3>
				<p>{route1.length} points</p>
			</div>
		</Popup>
	</Polyline>
	<Polyline
		latlngs={route2}
		options={{
			color: '#ff0000',
			weight: 5,
			opacity: 0.8,
			fillOpacity: 0.3
		}}
	>
		<Popup>
			<div>
				<h3>Route 2</h3>
				<p>{route2.length} points</p>
			</div>
		</Popup>
	</Polyline>
	<Polyline
		latlngs={multiSegmentRoute}
		options={{
			color: '#00ff00',
			weight: 4,
			opacity: 0.9,
			fillOpacity: 0.2
		}}
	>
		<Popup>
			<div>
				<h3>Multi-segment Route</h3>
				<p>{multiSegmentRoute.length} segments</p>
			</div>
		</Popup>
	</Polyline>
</LeafletMap>

<div class="overlay">
	<h3>Polyline Controls</h3>
	<div>
		<label for="color">Color:</label>
		<input type="color" bind:value={color} />
	</div>
	<div>
		<label for="weight">Weight:</label>
		<input type="range" min="1" max="10" step="1" bind:value={weight} />
		<span>{weight}</span>
	</div>
	<div>
		<label for="opacity">Opacity:</label>
		<input type="range" min="0" max="1" step="0.01" bind:value={opacity} />
		<span>{opacity.toFixed(2)}</span>
	</div>
	<div>
		<label for="fillOpacity">Fill Opacity:</label>
		<input type="range" min="0" max="1" step="0.01" bind:value={fillOpacity} />
		<span>{fillOpacity.toFixed(2)}</span>
	</div>
</div>

<style>
	.overlay {
		padding: 15px;
		background: white;
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 10000;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
		min-width: 200px;
	}

	.overlay h3 {
		margin-top: 0;
		margin-bottom: 10px;
	}

	.overlay > div {
		margin-bottom: 10px;
	}

	.overlay label {
		display: block;
		margin-bottom: 5px;
		font-weight: 500;
	}

	.overlay input[type='range'] {
		width: 100%;
	}

	.overlay input[type='color'] {
		width: 100%;
		height: 30px;
	}
</style>

