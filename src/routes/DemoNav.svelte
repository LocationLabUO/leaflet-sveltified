<script lang="ts">
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let open = $state(false);
	let navElement: HTMLDivElement;

	const routes = [
		{ path: '/', label: 'Home' },
		{ path: '/advanced', label: 'Advanced' },
		{ path: '/circle', label: 'Circle' },
		{ path: '/circle-marker', label: 'Circle Marker' },
		{ path: '/controls', label: 'Controls' },
		{ path: '/div-icon', label: 'Div Icon' },
		{ path: '/div-overlay', label: 'Div Overlay' },
		{ path: '/feature-groups', label: 'Feature Groups' },
		{ path: '/geojson', label: 'GeoJSON' },
		{ path: '/layer-groups', label: 'Layer Groups' },
		{ path: '/marker', label: 'Marker' },
		{ path: '/plugins/marker-cluster', label: 'Marker Cluster' },
		{ path: '/polyline', label: 'Polyline' },
		{ path: '/popup', label: 'Popup' },
		{ path: '/rectangle', label: 'Rectangle' },
		{ path: '/tile-layer', label: 'Tile Layer' },
		{ path: '/tooltip', label: 'Tooltip' },
		{ path: '/two-maps', label: 'Two Maps' },
		{ path: '/vector-layers', label: 'Vector Layers' }
	];

	const currentFeature = $derived.by(() => {
		const currentPath = $page.url.pathname;
		const route = routes.find((r) => r.path === currentPath);
		return route?.label || 'Demos';
	});

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}

	function handleClickOutside(event: MouseEvent) {
		if (navElement && !navElement.contains(event.target as Node)) {
			close();
		}
	}

	$effect(() => {
		if (open) {
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});
</script>

<div class="nav-container" bind:this={navElement}>
	<button class="trigger" onclick={toggle} aria-label="Toggle demo navigation">
		<span class="trigger-text">{currentFeature}</span>
		<span class="trigger-icon" class:open>▼</span>
	</button>

	{#if open}
		<div
			class="popover"
			transition:fly={{ y: 100, duration: 200, easing: quintOut }}
		>
			<nav class="nav-list">
				{#each routes as route (route.path)}
					<a
						href={route.path}
						class="nav-link"
						class:active={$page.url.pathname === route.path}
						onclick={close}
					>
						{route.label}
					</a>
				{/each}
			</nav>
		</div>
	{/if}
</div>

<style>
	.nav-container {
		position: absolute;
		bottom: 10px;
		left: 10px;
		z-index: 1000;
	}

	.trigger {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 12px;
		background: white;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		cursor: pointer;
		font-size: 12px;
		font-weight: 500;
		color: #333;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: background-color 0.2s, box-shadow 0.2s;
	}

	.trigger:hover {
		background: #f5f5f5;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
	}

	.trigger:active {
		background: #e8e8e8;
	}

	.trigger-text {
		user-select: none;
	}

	.trigger-icon {
		font-size: 10px;
		transition: transform 0.2s;
		transform: rotate(0deg);
	}

	.trigger-icon.open {
		transform: rotate(180deg);
	}

	.popover {
		position: absolute;
		bottom: 100%;
		left: 0;
		margin-bottom: 8px;
		background: white;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		overflow: hidden;
		min-width: 150px;
		max-height: 400px;
		overflow-y: auto;
	}

	.nav-list {
		display: flex;
		flex-direction: column;
		padding: 4px;
	}

	.nav-link {
		display: block;
		padding: 8px 12px;
		color: #333;
		text-decoration: none;
		font-size: 13px;
		border-radius: 3px;
		transition: background-color 0.15s;
		white-space: nowrap;
	}

	.nav-link:hover {
		background: #f0f0f0;
	}

	.nav-link.active {
		background: #e3f2fd;
		color: #1976d2;
		font-weight: 500;
	}

	/* Scrollbar styling for popover */
	.popover::-webkit-scrollbar {
		width: 6px;
	}

	.popover::-webkit-scrollbar-track {
		background: transparent;
	}

	.popover::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 3px;
	}

	.popover::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 0, 0, 0.3);
	}
</style>

