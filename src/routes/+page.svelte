<script lang="ts">
	import { Icon, LeafletMap, TileLayer, type MapEvents } from '$lib';
	import Marker from '$lib/layers/ui/Marker.svelte';

	let container: HTMLElement;

	function handle(e: MapEvents['zoomend']) {
		console.log(e);
	}
</script>

<div class="container" bind:this={container}>
	{#if container}
		<LeafletMap
			options={{
				center: [0, 0],
				zoom: 3
			}}
			{container}
			events={['zoomend']}
			on:zoomend={(e) => handle(e.detail)}
		>
			<TileLayer
				url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`}
				options={{
					maxZoom: 4
				}}
			/>
			<Marker latLng={[0, 0]}>
				<Icon />
			</Marker>
		</LeafletMap>
	{/if}
</div>

<style>
	.container {
		height: 600px;
		width: 600px;
	}
</style>
