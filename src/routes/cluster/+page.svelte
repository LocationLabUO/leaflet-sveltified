<script lang="ts">
	import {
		DivIcon,
		Icon,
		LeafletMap,
		Marker,
		MarkerClusterGroup,
		Popup,
		TileLayer,
		type MarkerClusterGroupEvents,
		type MarkerEvents
	} from '$lib';

	let container: HTMLElement;

	let showMap = false;

	let n = 3000;

	let loading = false;
	let markerListeners: (keyof MarkerEvents)[] = [];

	const points: [number, number][] = [];
	function getRandomLatLng(): [number, number] {
		return [-90 + 180 * Math.random(), -180 + 360 * Math.random()];
	}
	for (let i = 0; i < n; i = i + 1) {
		points.push(getRandomLatLng());
	}

	function handleLayerAdd(ev: MarkerClusterGroupEvents['layeradd']) {
		if (ev.target.getLayers().length == n) {
			loading = false;
			markerListeners = ['popupopen', 'popupclose', 'click'];
		}
	}

	function toggleMap() {
		if (showMap) {
			loading = false;
			markerListeners = [];
			showMap = false;
		} else {
			loading = true;
			showMap = true;
		}
	}

	let iconType = 'icon';
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

			{#if showMap}
				<MarkerClusterGroup
					options={{ animateAddingMarkers: false }}
					events={['layeradd']}
					on:layeradd={(ev) => {
						handleLayerAdd(ev.detail);
					}}
				>
					{#each points as p}
						<Marker
							latLng={p}
							events={markerListeners}
							on:popupopen={console.log}
							on:popupclose={console.log}
							on:click={console.log}
						>
							{#if iconType == 'icon'}
								<Icon />
							{:else}
								<DivIcon>
									<div class="customicon">{p}</div>
								</DivIcon>
							{/if}
							<Popup>
								<div>{p}</div>
							</Popup>
						</Marker>
					{/each}
				</MarkerClusterGroup>
			{/if}
		</LeafletMap>
	{/if}
</div>
Add marker cluster with<input bind:value={n} /> markers

{#if loading}
	Loading...
{:else}
	<button on:click={toggleMap}>Toggle Clusters</button>
{/if}

<button
	on:click={() => {
		if (iconType == 'icon') iconType = 'divicon';
		else iconType = 'icon';
	}}
>
	Using {iconType}
</button>
<p>
	Note: Using divIcons with cluster marker created some interesting behavior when the markers are
	inside clusters.
</p>
<p>Cluster marker groups add one marker at a time, so they need some time to load.</p>

<style>
	.customicon {
		background-color: white;
		width: fit-content;
	}
	.container {
		height: 80vh;
		width: 100%;
	}
</style>
