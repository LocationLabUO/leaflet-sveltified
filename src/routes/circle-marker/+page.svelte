<script lang="ts">
	import { CircleMarker, LeafletMap, Popup, TileLayer } from '$lib/index.js';

	let radius = $state(10);
	let color = $state('#3388ff');
	let fillColor = $state('#3388ff');
	let opacity = $state(1);
	let fillOpacity = $state(0.2);
	let weight = $state(3);
</script>

<LeafletMap options={{ center: [40.7128, -74.006], zoom: 10 }}>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
	<CircleMarker
		latlng={[40.7128, -74.006]}
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
				console.log('CircleMarker clicked!');
			}
		}}
	>
		<Popup>
			<div>
				<h3>CircleMarker Demo</h3>
				<p>Radius: {radius}px</p>
				<p>Note: CircleMarker maintains a fixed pixel size regardless of zoom level</p>
			</div>
		</Popup>
	</CircleMarker>
	<CircleMarker
		latlng={[40.7589, -73.9851]}
		options={{
			radius: 15,
			color: '#ff0000',
			fillColor: '#ff0000',
			opacity: 0.8,
			fillOpacity: 0.3,
			weight: 2
		}}
	>
		<Popup>
			<div>
				<h3>Another CircleMarker</h3>
				<p>Fixed size marker</p>
			</div>
		</Popup>
	</CircleMarker>
	<CircleMarker
		latlng={[40.7489, -73.9681]}
		options={{
			radius: 8,
			color: '#00ff00',
			fillColor: '#00ff00',
			opacity: 1,
			fillOpacity: 0.5,
			weight: 1
		}}
	>
		<Popup>
			<div>
				<h3>Small CircleMarker</h3>
				<p>Small radius example</p>
			</div>
		</Popup>
	</CircleMarker>
</LeafletMap>

<div class="overlay">
	<h3>CircleMarker Controls</h3>
	<div>
		<label for="radius">Radius (px):</label>
		<input type="range" min="5" max="50" step="1" bind:value={radius} />
		<span>{radius}</span>
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
</style>
