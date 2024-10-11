<script lang="ts">
	import TileLayer from '$lib/layers/raster/TileLayer.svelte';
	import DivIcon from '$lib/layers/ui/Marker/DivIcon/DivIcon.svelte';
	import Marker from '$lib/layers/ui/Marker/Marker.svelte';
	import LeafletMap from '$lib/map/LeafletMap.svelte';

	let draggable = $state(false);
	let count = $state(0);
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />

	<Marker latlng={[10, 10]} options={{ draggable }}>
		<DivIcon options={{}}>
			<div class="icon">
				Hello World
				<div>
					<div>{count}</div>
					<button onclick={() => count++}>+</button>
					<button onclick={() => count--}>-</button>
					<button onclick={() => (count = 0)}>Reset</button>
				</div>
				<div>These icons are also just components</div>
			</div>
		</DivIcon>
	</Marker>
</LeafletMap>

<div class="overlay">
	<label for="draggable">Draggable:</label>
	<input type="checkbox" bind:checked={draggable} />
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

	.icon {
		background-color: white;
		width: 200px;
	}
</style>
