<script lang="ts">
	import { Icon, LeafletMap, Marker, Popup, TileLayer } from '$lib';

	let container: HTMLElement;

	let n = 0;
	const points: [number, number][] = [];
	function getRandomLatLng(): [number, number] {
		return [-90 + 180 * Math.random(), -180 + 360 * Math.random()];
	}
	for (let i = 0; i < n; i = i + 1) {
		points.push(getRandomLatLng());
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
		>
			<TileLayer
				url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`}
				options={{
					maxZoom: 18
				}}
			/>
			<Marker latLng={[0, 0]}>
				<Icon />
				<Popup>
					<div>This is a svelte component</div>
					<button
						on:click={() => {
							n = n + 1;
						}}>Increment: {n}</button
					>
				</Popup>
			</Marker>
		</LeafletMap>
	{/if}
</div>

<style>
	.container {
		height: 100vh;
		width: 100%;
	}
</style>
