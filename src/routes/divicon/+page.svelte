<script lang="ts">
	import { LeafletMap, Marker, TileLayer } from '$lib';
	import DivIcon from '$lib/layers/ui/DivIcon.svelte';

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
			<Marker
				latLng={[0, 0]}
				options={{ draggable: true }}
				events={['dragend']}
				on:dragend={console.log}
			>
				<DivIcon>
					<div>
						<button
							on:click={() => {
								n = n + 1;
							}}>clicky {n}</button
						>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M19 10c0 1.38-2.12 2.5-3.5 2.5s-2.75-1.12-2.75-2.5h-1.5c0 1.38-1.37 2.5-2.75 2.5S5 11.38 5 10h-.75c-.16.64-.25 1.31-.25 2a8 8 0 0 0 8 8a8 8 0 0 0 8-8c0-.69-.09-1.36-.25-2H19m-7-6C9.04 4 6.45 5.61 5.07 8h13.86C17.55 5.61 14.96 4 12 4m10 8a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2a10 10 0 0 1 10 10m-10 5.23c-1.75 0-3.29-.73-4.19-1.81L9.23 14c.45.72 1.52 1.23 2.77 1.23s2.32-.51 2.77-1.23l1.42 1.42c-.9 1.08-2.44 1.81-4.19 1.81Z"
							/></svg
						>
					</div>
				</DivIcon>
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
