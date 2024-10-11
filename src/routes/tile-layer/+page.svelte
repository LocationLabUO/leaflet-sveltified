<script lang="ts">
	import TileLayer from '$lib/layers/raster/TileLayer.svelte';
	import LeafletMap from '$lib/map/LeafletMap.svelte';

	let url = $state(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`);
	let options = $state({ opacity: 0.5 });
	let boundAction = $state(true);
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer
		{url}
		{options}
		events={{
			tileload: boundAction
				? (e) => {
						console.log('loaded', e.tile.src);
					}
				: undefined
		}}
	/>
</LeafletMap>

<div class="overlay">
	<div>
		Try tile layers from <a href="https://wiki.openstreetmap.org/wiki/Raster_tile_providers">
			https://wiki.openstreetmap.org/wiki/Raster_tile_providers
		</a>
	</div>
	<div>
		<label for="url">Url:</label>
		<input type="text" bind:value={url} />
	</div>

	<label for="options">Options:</label>
	<input type="number" bind:value={options.opacity} min="0" max="1" step="0.1" />

	<label for="boundAction">Log loaded:</label>
	<input type="checkbox" bind:checked={boundAction} />
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

	input[type='text'] {
		width: 400px;
	}
</style>
