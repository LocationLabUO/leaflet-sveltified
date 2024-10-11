<script lang="ts">
	import TileLayer from '$lib/layers/raster/TileLayer.svelte';
	import Icon from '$lib/layers/ui/Marker/Icon/Icon.svelte';
	import Marker from '$lib/layers/ui/Marker/Marker.svelte';
	import LeafletMap from '$lib/map/LeafletMap.svelte';

	let draggable = $state(false);
	let color = $state('green');
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
	<Marker
		latlng={[0, 0]}
		options={{ draggable }}
		events={{
			click: () => {
				console.log('clicked');
			}
		}}
	/>
	<Marker latlng={[10, 10]} options={{ draggable }}>
		{#snippet icon()}
			<Icon
				options={{
					iconUrl: `https://leafletjs.com/examples/custom-icons/leaf-${color}.png`,
					shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
					iconSize: [38, 95], // size of the icon
					shadowSize: [50, 64], // size of the shadow
					iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
					shadowAnchor: [4, 62], // the same for the shadow
					popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
				}}
			/>
		{/snippet}
	</Marker>
	<Marker
		latlng={[20, 20]}
		options={{
			draggable
		}}
		events={{
			dragend: (e) => {
				console.log(e);
				console.log(`dragged: ${e.distance}`);
			}
		}}
	/>
</LeafletMap>

<div class="overlay">
	<label for="draggable">Draggable:</label>
	<input type="checkbox" bind:checked={draggable} />

	<label for="color">Color:</label>
	<select bind:value={color}>
		<option value="green">Green</option>
		<option value="red">Red</option>
		<option value="orange">Orange</option>
	</select>
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
