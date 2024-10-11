<script lang="ts">
	import LayerGroup from '$lib/layers/LayerGroup/LayerGroup.svelte';
	import TileLayer from '$lib/layers/raster/TileLayer.svelte';
	import LeafletMap from '$lib/map/LeafletMap.svelte';
	import type { LeafletMouseEventHandlerFn, MapOptions } from 'leaflet';

	let show = $state(true);
	let click = $state(true);
	let ze = $state(true);
	$inspect(show);

	const handleClick: LeafletMouseEventHandlerFn = (event) => {
		console.log(event.latlng);
	};

	let options: MapOptions = $state({ center: [0, 0], zoom: 3, maxZoom: 10 });
</script>

{#if show}
	<LeafletMap
		{options}
		events={{
			click: click ? handleClick : undefined,
			contextmenu: () => {
				console.log('c');
			}
		}}
	>
		<TileLayer
			url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`}
			options={{
				maxZoom: 18
			}}
		/>
		<LayerGroup options={{}}></LayerGroup>
	</LeafletMap>
{/if}

<div class="overlay">
	<label for="show">Show Map:</label>
	<input type="checkbox" bind:checked={show} />

	<input type="number" bind:value={options.zoom} />

	<div>
		<label for="show">Bind Click:</label>
		<input type="checkbox" bind:checked={click} />

		<label for="show">Bind Zoom End:</label>
		<input type="checkbox" bind:checked={ze} />
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
