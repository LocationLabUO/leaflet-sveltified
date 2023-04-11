<script lang="ts">
	import { Icon, LeafletMap, Marker, MarkerClusterGroup, TileLayer, type MapEvents } from '$lib';
	import Popup from '$lib/layers/ui/Popup.svelte';

	let container: HTMLElement;

	let showMap: boolean = false;

	function getRandomLatLng(): [number, number] {
		return [-90 + 180 * Math.random(), -180 + 360 * Math.random()];
	}

	let rendered = 0;
	const p = 5000;
	async function getPoints() {
		const points: [number, number][] = [];
		for (let i = 0; i < p; i = i + 1) {
			points.push(getRandomLatLng());
		}
		console.log(points);
		return points;
	}

	function moveEnd(e: MapEvents['moveend']) {
		console.log(e);
	}

	let events: (keyof MapEvents)[] = ['moveend'];

	function toggleMap() {
		showMap = !showMap;
		if (showMap) rendered = 0;
	}

	function toggleZoom() {
		if (events.includes('zoomend')) {
			events = ['moveend'];
		} else {
			events = [...events, 'zoomend'];
		}
	}

	function addRendered() {
		console.log(rendered);
		rendered = rendered + 1;
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
				{events}
				on:moveend={(e) => moveEnd(e.detail)}
				on:zoomend={(e) => moveEnd(e.detail)}
			>
				<TileLayer
					url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`}
					options={{
						maxZoom: 18
					}}
				/>
				<MarkerClusterGroup options={{ chunkedLoading: true, chunkInterval: 200 }}>
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
	<button on:click={toggleMap}> Clicky </button>
	<button on:click={toggleZoom}> Toggle </button>
	{#if rendered < p}
		Loading...
	{/if}
{/await}

<style>
	.container {
		height: 600px;
		width: 600px;
	}
</style>
