<script lang="ts">
	import {
		AttributionControl,
		Control,
		LeafletMap,
		ScaleControl,
		TileLayer,
		ZoomControl
	} from '$lib/index.js';
	import Counter from '../Counter.svelte';

	type ControlPosition = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

	let zoomPosition: ControlPosition | undefined = $state('topright');
	let layersPosition: ControlPosition | undefined = $state();
	let scalePosition: ControlPosition | undefined = $state('bottomleft');
	let customPosition: ControlPosition | undefined = $state('topleft');
	let attributionPosition: ControlPosition | undefined = $state('bottomright');

	let attributions = $state(['Leaflet']);
	function toggleAttribution() {
		if (attributions.includes('OpenStreetMap')) {
			attributions = attributions.filter((a) => a !== 'OpenStreetMap');
		} else {
			attributions.push('OpenStreetMap');
		}
	}
</script>

<LeafletMap
	options={{ center: [0, 0], zoom: 3, maxZoom: 10, zoomControl: false, attributionControl: false }}
>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} options={{}} />
	{#if zoomPosition}
		<ZoomControl options={{ position: zoomPosition }} />
	{/if}
	{#if layersPosition}{/if}
	{#if scalePosition}
		<ScaleControl options={{ position: scalePosition }} />
	{/if}
	{#if customPosition}
		<Control options={{ position: customPosition }}>
			<div class="a">
				<Counter />
			</div>
		</Control>
	{/if}
	{#if attributionPosition}
		<AttributionControl options={{ position: attributionPosition, prefix: false }} {attributions} />
	{/if}
</LeafletMap>

<div class="overlay">
	Controls:
	<div>
		<label for="zoomPosition"> Zoom: </label>
		<select bind:value={zoomPosition} id="zoomPosition">
			<option value="topleft">Top Left</option>
			<option value="topright">Top Right</option>
			<option value="bottomleft">Bottom Left</option>
			<option value="bottomright">Bottom Right</option>
		</select>
	</div>
	<div>
		<label for="scalePosition"> Scale: </label>
		<select id="scalePosition" bind:value={scalePosition}>
			<option value="topleft">Top Left</option>
			<option value="topright">Top Right</option>
			<option value="bottomleft">Bottom Left</option>
			<option value="bottomright">Bottom Right</option>
		</select>
	</div>
	<div>
		<label for="customPosition"> Custom: </label>
		<select id="customPosition" bind:value={customPosition}>
			<option value="topleft">Top Left</option>
			<option value="topright">Top Right</option>
			<option value="bottomleft">Bottom Left</option>
			<option value="bottomright">Bottom Right</option>
		</select>
	</div>
	<div>
		<label for="attributionPosition"> Attribution: </label>
		<select id="attributionPosition" bind:value={attributionPosition}>
			<option value="topleft">Top Left</option>
			<option value="topright">Top Right</option>
			<option value="bottomleft">Bottom Left</option>
			<option value="bottomright">Bottom Right</option>
		</select>
		<button onclick={toggleAttribution}>Toggle OSM Attribution</button>
	</div>
</div>

<style>
	.overlay {
		padding: 10px;
		background: white;
		position: absolute;
		top: 50%;
		right: 50%;
		transform: translate(50%, -50%);
		z-index: 10000;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}
</style>
