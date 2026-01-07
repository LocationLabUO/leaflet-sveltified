# Leaflet Sveltified

A declarative Svelte 5 wrapper for [Leaflet](https://leafletjs.com/), providing a component-based API for building interactive maps.

## Features

- 🗺️ **Full Leaflet Integration** - All major Leaflet features available as Svelte components
- ⚡ **Svelte 5 Runes** - Built with modern Svelte 5 runes (`$state`, `$effect`, `$props`)
- 🔄 **Reactive by Default** - Props automatically sync with Leaflet objects
- 📦 **TypeScript Support** - Full type definitions for all components
- 🎨 **Declarative API** - Compose maps using familiar Svelte component syntax
- 🧩 **Plugin Support** - Includes MarkerCluster plugin support
- 🧹 **Automatic Cleanup** - Proper memory management and event cleanup

## Installation

```bash
npm install @locationlabuo/leaflet-sveltified leaflet
```

**Note:** This library requires Svelte 5. Make sure you're using `svelte@^5.0.0`.

## Quick Start

```svelte
<script>
	import { LeafletMap, TileLayer, Marker, Popup } from '@locationlabuo/leaflet-sveltified';
</script>

<LeafletMap options={{ center: [51.505, -0.09], zoom: 13 }}>
	<TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
	<Marker latlng={[51.505, -0.09]}>
		<Popup>
			<h2>Hello World!</h2>
			<p>This is a popup.</p>
		</Popup>
	</Marker>
</LeafletMap>
```

## Basic Usage

### Map Component

The `LeafletMap` component is the root container for all map features.

```svelte
<script>
	import { LeafletMap } from '@locationlabuo/leaflet-sveltified';
	import type { MapOptions } from 'leaflet';

	let mapOptions: MapOptions = $state({
		center: [51.505, -0.09],
		zoom: 13,
		maxZoom: 19
	});
</script>

<LeafletMap {options} />
```

### Tile Layers

Add tile layers to display map imagery:

```svelte
<script>
	import { LeafletMap, TileLayer } from '@locationlabuo/leaflet-sveltified';
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
</LeafletMap>
```

### Markers

Add markers to the map:

```svelte
<script>
	import { LeafletMap, TileLayer, Marker } from '@locationlabuo/leaflet-sveltified';

	let position = $state([51.505, -0.09]);
	let draggable = $state(false);
</script>

<LeafletMap options={{ center: position, zoom: 13 }}>
	<TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
	<Marker
		latlng={position}
		options={{ draggable }}
		events={{
			dragend: (e) => {
				position = [e.target.getLatLng().lat, e.target.getLatLng().lng];
			}
		}}
	/>
</LeafletMap>
```

### Custom Icons

Use the `Icon` snippet to customize marker icons:

```svelte
<script>
	import { LeafletMap, TileLayer, Marker, Icon } from '@locationlabuo/leaflet-sveltified';

	let color = $state('green');
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
	<Marker latlng={[10, 10]}>
		{#snippet icon()}
			<Icon
				options={{
					iconUrl: `https://leafletjs.com/examples/custom-icons/leaf-${color}.png`,
					shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
					iconSize: [38, 95],
					shadowSize: [50, 64],
					iconAnchor: [22, 94],
					shadowAnchor: [4, 62],
					popupAnchor: [-3, -76]
				}}
			/>
		{/snippet}
	</Marker>
</LeafletMap>
```

### Popups and Tooltips

Add interactive popups and tooltips:

```svelte
<script>
	import { LeafletMap, TileLayer, Marker, Popup, Tooltip } from '@locationlabuo/leaflet-sveltified';

	let popupOpen = $state(false);
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
	<Marker latlng={[10, 10]}>
		<Popup bind:open={popupOpen}>
			<h2>Bound Popup</h2>
			<p>This popup's open state is bound to a variable.</p>
		</Popup>
		<Tooltip>Hover tooltip</Tooltip>
	</Marker>
</LeafletMap>
```

### Vector Layers

Add polygons, polylines, circles, and rectangles:

```svelte
<script>
	import {
		LeafletMap,
		TileLayer,
		Polygon,
		Polyline,
		Circle,
		Rectangle
	} from '@locationlabuo/leaflet-sveltified';
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

	<Polygon
		latlngs={[
			[0, 0],
			[10, 0],
			[10, 10],
			[0, 10]
		]}
		options={{ color: 'blue', fillColor: 'lightblue' }}
	/>

	<Polyline
		latlngs={[
			[-10, -10],
			[0, 0],
			[10, 10]
		]}
		options={{ color: 'red' }}
	/>

	<Circle latlng={[20, 20]} options={{ radius: 50000, color: 'green' }} />

	<Rectangle
		bounds={[
			[30, 30],
			[40, 40]
		]}
		options={{ color: 'purple' }}
	/>
</LeafletMap>
```

### Layer Groups

Organize layers into groups:

```svelte
<script>
	import { LeafletMap, TileLayer, LayerGroup, Marker } from '@locationlabuo/leaflet-sveltified';
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
	<LayerGroup>
		<Marker latlng={[10, 10]} />
		<Marker latlng={[20, 20]} />
		<Marker latlng={[30, 30]} />
	</LayerGroup>
</LeafletMap>
```

### GeoJSON

Display GeoJSON data:

```svelte
<script>
	import { LeafletMap, TileLayer, GeoJSON } from '@locationlabuo/leaflet-sveltified';

	const geojsonData = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [0, 0]
				},
				properties: {
					name: 'Point 1'
				}
			}
		]
	};
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
	<GeoJSON data={geojsonData} />
</LeafletMap>
```

### Event Handling

All components support event handlers through the `events` prop:

```svelte
<script>
	import { LeafletMap, TileLayer, Marker } from '@locationlabuo/leaflet-sveltified';
	import type { LeafletMouseEventHandlerFn } from 'leaflet';

	const handleClick: LeafletMouseEventHandlerFn = (e) => {
		console.log('Marker clicked at:', e.latlng);
	};
</script>

<LeafletMap
	options={{ center: [0, 0], zoom: 3 }}
	events={{
		click: (e) => console.log('Map clicked:', e.latlng)
	}}
>
	<TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
	<Marker
		latlng={[10, 10]}
		events={{
			click: handleClick,
			dragend: (e) => console.log('Marker dragged')
		}}
	/>
</LeafletMap>
```

### Marker Clustering

Use the MarkerCluster plugin for clustering markers:

```svelte
<script>
	import { LeafletMap, TileLayer } from '@locationlabuo/leaflet-sveltified';
	import { MarkerCluster } from '@locationlabuo/leaflet-sveltified/plugins';
	import Marker from '@locationlabuo/leaflet-sveltified';
</script>

<LeafletMap options={{ center: [0, 0], zoom: 3 }}>
	<TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
	<MarkerCluster>
		<Marker latlng={[10, 10]} />
		<Marker latlng={[10.1, 10.1]} />
		<Marker latlng={[10.2, 10.2]} />
	</MarkerCluster>
</LeafletMap>
```

## Component API

### LeafletMap

The root map component.

**Props:**

- `options: MapOptions` (required) - Leaflet map options
- `events?: LeafletEventHandlerFnMap` - Map event handlers
- `getMap?: () => Map | undefined` - Bindable function to get the underlying Leaflet Map instance
- `children?: Snippet` - Child components (layers, controls, etc.)

### Layer Components

All layer components share common props:

- `options?: LayerOptions` - Leaflet layer options
- `events?: EventHandlers` - Event handlers specific to the layer type
- `children?: Snippet` - Child components (popups, tooltips, etc.)

**Available Layer Components:**

- `TileLayer` - Raster tile layers
- `Marker` - Point markers
- `Polygon` - Polygon shapes
- `Polyline` - Polyline shapes
- `Circle` - Circle shapes
- `CircleMarker` - Circle markers (fixed pixel size)
- `Rectangle` - Rectangle shapes
- `GeoJSON` - GeoJSON data layers
- `LayerGroup` - Groups of layers
- `FeatureGroup` - Feature groups with event handling

### UI Components

- `Popup` - Popup overlays

  - `open?: boolean` (bindable) - Control popup visibility
  - `options?: PopupOptions` - Popup options
  - `events?: PopupEventHandlers` - Event handlers
  - `children?: Snippet` - Popup content

- `Tooltip` - Tooltip overlays

  - `open?: boolean` (bindable) - Control tooltip visibility
  - `options?: TooltipOptions` - Tooltip options
  - `events?: TooltipEventHandlers` - Event handlers
  - `children?: Snippet` - Tooltip content

- `DivOverlay` - Custom div overlays

  - `open?: boolean` (bindable) - Control overlay visibility
  - `latlng?: LatLngExpression` - Overlay position
  - `options?: DivOverlayOptions` - Overlay options
  - `events?: DivOverlayEventHandlers` - Event handlers
  - `children?: Snippet` - Overlay content

- `Icon` - Custom marker icons (used as snippet)

  - `options: IconOptions` (required) - Icon options

- `DivIcon` - HTML div icons (used as snippet)
  - `options?: DivIconOptions` - DivIcon options
  - `children?: Snippet` - Icon content

### Control Components

- `ZoomControl` - Zoom control
- `ScaleControl` - Scale control
- `AttributionControl` - Attribution control
- `Control` - Custom controls

All control components accept:

- `options?: ControlOptions` - Control options
- `events?: ControlEventHandlers` - Event handlers

## Advanced Usage

### Accessing Leaflet Instances

Use context functions to access underlying Leaflet objects:

```svelte
<script>
	import { getMapContext, getMarkerContext } from '@locationlabuo/leaflet-sveltified';

	const mapContext = getMapContext();
	const markerContext = getMarkerContext();

	// Access the Leaflet Map instance
	const map = mapContext?.map;

	// Access the Leaflet Marker instance
	const marker = markerContext?.marker;
</script>
```

### Reactive Updates

All props are reactive. Changes to props automatically update the Leaflet objects:

```svelte
<script>
	let position = $state([51.505, -0.09]);
	let opacity = $state(1.0);
</script>

<Marker latlng={position} options={{ opacity }} />
<!-- 
  When position or opacity change, the marker automatically updates
-->
```

### Conditional Rendering

Components handle mounting/unmounting automatically:

```svelte
<script>
	let showMarker = $state(true);
</script>

{#if showMarker}
	<Marker latlng={[10, 10]} />
{/if}
<!-- Marker is properly removed from map when showMarker becomes false -->
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions. All component props are typed using Leaflet's type definitions.

```typescript
import type { MapOptions, LatLngExpression } from 'leaflet';
import { LeafletMap, Marker } from '@locationlabuo/leaflet-sveltified';

const options: MapOptions = {
	center: [51.505, -0.09],
	zoom: 13
};

const position: LatLngExpression = [51.505, -0.09];
```

## Development

This library is built with:

- Svelte 5
- SvelteKit
- TypeScript
- Leaflet

### Running the Development Server

```bash
npm install
npm run dev
```

### Building

```bash
npm run build
```

### Package the Library

```bash
npm run package
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Repository

[GitHub](https://github.com/locationlabuo/leaflet-sveltified)

## Acknowledgments

Built by the [Location Innovation Lab](https://github.com/locationlabuo) at the University of Oregon.
