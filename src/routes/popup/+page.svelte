<script lang="ts">
	import TileLayer from '$lib/layers/raster/TileLayer.svelte';
	import Marker from '$lib/layers/ui/Marker/Marker.svelte';
	import Popup from '$lib/layers/ui/Popup/Popup.svelte';
	import LeafletMap from '$lib/map/LeafletMap.svelte';
	import Counter from '../Counter.svelte';

	let open = $state(true);
	let bindAdd = $state(false);

	let count = $state(0);
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />
	<Marker latlng={[10, 10]}>
		<Popup
			bind:open
			options={{}}
			events={{
				add: bindAdd
					? () => {
							console.log('added');
						}
					: undefined
			}}
		>
			<div>Bound Open state</div>

			<div>This Counter is a component nested in the popup</div>
			<Counter popup={true} />
		</Popup>
	</Marker>
	<Marker latlng={[0, 0]}>
		<Popup
			options={{}}
			events={{
				add: bindAdd
					? () => {
							console.log('added');
						}
					: undefined
			}}
		>
			<div>Leaflet handles this one</div>

			<div>This Counter has it's state declared outside of the popup</div>
			<div>Count: {count}</div>

			<button onclick={() => count++}>+</button>
			<button onclick={() => count--}>-</button>
			<button onclick={() => (count = 0)}>Reset</button>
		</Popup>
	</Marker>
</LeafletMap>
<div class="overlay">
	<label for="open">Open State:</label>
	<input type="checkbox" bind:checked={open} />

	<label for="bindAdd">Bind Add:</label>
	<input type="checkbox" bind:checked={bindAdd} />
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
