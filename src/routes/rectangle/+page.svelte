<script lang="ts">
	import { LeafletMap, Popup, Rectangle, TileLayer } from '$lib/index.js';
	import type { LatLngBoundsExpression } from 'leaflet';

	let southWestLat = $state(44.0389);
	let southWestLng = $state(-123.0821);
	let northEastLat = $state(44.0509);
	let northEastLng = $state(-123.0621);
	let color = $state('#3388ff');
	let fillColor = $state('#3388ff');
	let opacity = $state(1);
	let fillOpacity = $state(0.2);
	let weight = $state(3);

	let bounds = $derived([[southWestLat, southWestLng], [northEastLat, northEastLng]]);
</script>

<LeafletMap options={{ center: [44.0449, -123.0721], zoom: 11 }}>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
	<Rectangle
		{bounds}
		options={{
			color,
			fillColor,
			opacity,
			fillOpacity,
			weight
		}}
		events={{
			click: () => {
				console.log('Rectangle clicked!');
			}
		}}
	>
		<Popup>
			<div>
				<h3>Rectangle Demo</h3>
				<p>Southwest: [{southWestLat.toFixed(4)}, {southWestLng.toFixed(4)}]</p>
				<p>Northeast: [{northEastLat.toFixed(4)}, {northEastLng.toFixed(4)}]</p>
			</div>
		</Popup>
	</Rectangle>
	<Rectangle
		bounds={[[44.0509, -123.0751], [44.0569, -123.0651]]}
		options={{
			color: '#ff0000',
			fillColor: '#ff0000',
			opacity: 0.8,
			fillOpacity: 0.3,
			weight: 2
		}}
	>
		<Popup>
			<div>
				<h3>Another Rectangle</h3>
				<p>Fixed bounds example</p>
			</div>
		</Popup>
	</Rectangle>
	<Rectangle
		bounds={[[44.0409, -123.0781], [44.0449, -123.0741]]}
		options={{
			color: '#00ff00',
			fillColor: '#00ff00',
			opacity: 1,
			fillOpacity: 0.5,
			weight: 1
		}}
	>
		<Popup>
			<div>
				<h3>Small Rectangle</h3>
				<p>Small bounds example</p>
			</div>
		</Popup>
	</Rectangle>
</LeafletMap>

<div class="overlay">
	<h3>Rectangle Controls</h3>
	<div>
		<label for="southWestLat">Southwest Lat:</label>
		<input type="number" step="0.001" bind:value={southWestLat} />
	</div>
	<div>
		<label for="southWestLng">Southwest Lng:</label>
		<input type="number" step="0.001" bind:value={southWestLng} />
	</div>
	<div>
		<label for="northEastLat">Northeast Lat:</label>
		<input type="number" step="0.001" bind:value={northEastLat} />
	</div>
	<div>
		<label for="northEastLng">Northeast Lng:</label>
		<input type="number" step="0.001" bind:value={northEastLng} />
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

