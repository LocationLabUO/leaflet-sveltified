<script lang="ts">
	import { Circle, LeafletMap, Popup, TileLayer } from '$lib/index.js';
	import type { LatLngExpression } from 'leaflet';

	let lat = $state(44.0449);
	let lng = $state(-123.0721);
	let radius = $state(500);
	let color = $state('#3388ff');
	let fillColor = $state('#3388ff');
	let opacity = $state(1);
	let fillOpacity = $state(0.2);
	let weight = $state(3);

	let latlng = $derived([lat, lng] as LatLngExpression);
</script>

<LeafletMap options={{ center: [44.0449, -123.0721], zoom: 11 }}>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
	<Circle
		{latlng}
		options={{
			radius,
			color,
			fillColor,
			opacity,
			fillOpacity,
			weight
		}}
		events={{
			click: () => {
				console.log('Circle clicked!');
			}
		}}
	>
		<Popup>
			<div>
				<h3>Circle Demo</h3>
				<p>Center: [{lat.toFixed(4)}, {lng.toFixed(4)}]</p>
				<p>Radius: {radius}m</p>
			</div>
		</Popup>
	</Circle>
	<Circle
		latlng={[44.0509, -123.0651]}
		options={{
			radius: 300,
			color: '#ff0000',
			fillColor: '#ff0000',
			opacity: 0.8,
			fillOpacity: 0.3,
			weight: 2
		}}
	>
		<Popup>
			<div>
				<h3>Another Circle</h3>
				<p>Fixed radius example</p>
			</div>
		</Popup>
	</Circle>
	<Circle
		latlng={[44.0389, -123.0791]}
		options={{
			radius: 150,
			color: '#00ff00',
			fillColor: '#00ff00',
			opacity: 1,
			fillOpacity: 0.5,
			weight: 1
		}}
	>
		<Popup>
			<div>
				<h3>Small Circle</h3>
				<p>Small radius example</p>
			</div>
		</Popup>
	</Circle>
</LeafletMap>

<div class="overlay">
	<h3>Circle Controls</h3>
	<div>
		<label for="lat">Latitude:</label>
		<input type="number" step="0.0001" bind:value={lat} />
	</div>
	<div>
		<label for="lng">Longitude:</label>
		<input type="number" step="0.0001" bind:value={lng} />
	</div>
	<div>
		<label for="radius">Radius (meters):</label>
		<input type="number" step="10" min="1" bind:value={radius} />
	</div>
	<div>
		<label for="color">Color:</label>
		<input type="color" bind:value={color} />
	</div>
	<div>
		<label for="fillColor">Fill Color:</label>
		<input type="color" bind:value={fillColor} />
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
	<div>
		<label for="weight">Weight:</label>
		<input type="range" min="1" max="10" step="1" bind:value={weight} />
		<span>{weight}</span>
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

	.overlay input[type='number'] {
		width: 100%;
		padding: 4px;
	}
</style>

