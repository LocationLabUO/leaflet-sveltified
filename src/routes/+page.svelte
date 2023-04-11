<script lang="ts">
	import { Icon, LeafletMap, Marker, MarkerClusterGroup, TileLayer } from '$lib';
	import Popup from '$lib/layers/ui/Popup.svelte';

	let container: HTMLElement;

	let showMap: boolean = false;

	function getRandomLatLng(): [number, number] {
		return [-90 + 180 * Math.random(), -180 + 360 * Math.random()];
	}

	async function getPoints() {
		const points: [number, number][] = [];
		for (let i = 0; i < 1000; i = i + 1) {
			points.push(getRandomLatLng());
		}
		console.log(points);
		return points;
	}
</script>

{#await getPoints() then points}
	<div class="container" bind:this={container}>
		{#if showMap && container}
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
				<MarkerClusterGroup options={{}}>
					{#each points as p}
						<Marker latLng={p}>
							<Icon />
							<Popup>
								<div>{p}</div>
							</Popup>
						</Marker>
					{/each}
				</MarkerClusterGroup>
			</LeafletMap>
		{/if}
	</div>
	<button on:click={() => (showMap = !showMap)}> Clicky </button>
{/await}

<style>
	.container {
		height: 600px;
		width: 600px;
	}
</style>
