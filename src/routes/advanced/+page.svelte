<script lang="ts">
	import {
		AttributionControl,
		Circle,
		CircleMarker,
		DivIcon,
		FeatureGroup,
		GeoJSON,
		Icon,
		LayerGroup,
		LeafletMap,
		Marker,
		Polygon,
		Polyline,
		Popup,
		ScaleControl,
		TileLayer,
		Tooltip,
		ZoomControl
	} from '$lib/index.js';

	import type { LatLngExpression } from 'leaflet';

	// Feature management
	type FeatureType = 'marker' | 'circleMarker' | 'circle' | 'polyline' | 'polygon';

	interface Feature {
		id: string;
		type: FeatureType;
		latlng?: LatLngExpression;
		latlngs?: LatLngExpression | LatLngExpression[] | LatLngExpression[][];
		color: string;
		fillColor: string;
		opacity: number;
		fillOpacity: number;
		weight: number;
		radius?: number;
		label: string;
	}

	let features = $state<Feature[]>([]);
	let selectedFeatureId = $state<string | null>(null);
	let nextId = $state(1);

	// UI State
	let showMarkers = $state(true);
	let showCircles = $state(true);
	let showPolylines = $state(true);
	let showPolygons = $state(true);
	let showFeatureGroup = $state(true);
	let showLayerGroup = $state(true);
	let showGeoJSON = $state(true);

	// Editing state
	let editingType = $state<FeatureType>('marker');
	let editingColor = $state('#3388ff');
	let editingFillColor = $state('#3388ff');
	let editingOpacity = $state(1);
	let editingFillOpacity = $state(0.2);
	let editingWeight = $state(3);
	let editingRadius = $state(10);
	let editingLabel = $state('New Feature');

	// Map interaction
	let clickMode: 'add' | 'select' | null = $state(null);
	let polylinePoints = $state<LatLngExpression[]>([]);
	let polygonPoints = $state<LatLngExpression[]>([]);
	let isDrawingPolyline = $state(false);
	let isDrawingPolygon = $state(false);

	// Sample GeoJSON data
	const sampleGeoJSON: GeoJSON.FeatureCollection = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				properties: { name: 'Sample Point' },
				geometry: {
					type: 'Point',
					coordinates: [-73.9851, 40.7589]
				}
			},
			{
				type: 'Feature',
				properties: { name: 'Sample Line' },
				geometry: {
					type: 'LineString',
					coordinates: [
						[-74.006, 40.7128],
						[-73.9851, 40.7589],
						[-73.9681, 40.7489]
					]
				}
			}
		]
	};

	function addFeature(type: FeatureType, latlng?: LatLngExpression) {
		const feature: Feature = {
			id: `feature-${nextId++}`,
			type,
			latlng: latlng || [40.7128 + Math.random() * 0.1, -74.006 + Math.random() * 0.1],
			color: editingColor,
			fillColor: editingFillColor,
			opacity: editingOpacity,
			fillOpacity: editingFillOpacity,
			weight: editingWeight,
			radius: editingRadius,
			label: editingLabel
		};

		if (type === 'polyline' && polylinePoints.length > 0) {
			feature.latlngs = [...polylinePoints];
			polylinePoints = [];
			isDrawingPolyline = false;
		} else if (type === 'polygon' && polygonPoints.length > 0) {
			feature.latlngs = [...polygonPoints];
			polygonPoints = [];
			isDrawingPolygon = false;
		}

		features = [...features, feature];
		selectedFeatureId = feature.id;
	}

	function removeFeature(id: string) {
		features = features.filter((f) => f.id !== id);
		if (selectedFeatureId === id) {
			selectedFeatureId = null;
		}
	}

	function updateFeature(id: string, updates: Partial<Feature>) {
		features = features.map((f) => (f.id === id ? { ...f, ...updates } : f));
	}

	function getSelectedFeature() {
		return features.find((f) => f.id === selectedFeatureId);
	}

	function handleMapClick(e: any) {
		if (clickMode === 'add') {
			const latlng: LatLngExpression = [e.latlng.lat, e.latlng.lng];

			if (isDrawingPolyline) {
				polylinePoints = [...polylinePoints, latlng];
			} else if (isDrawingPolygon) {
				polygonPoints = [...polygonPoints, latlng];
			} else {
				addFeature(editingType, latlng);
			}
		}
	}

	function startDrawingPolyline() {
		isDrawingPolyline = true;
		isDrawingPolygon = false;
		polylinePoints = [];
		clickMode = 'add';
		editingType = 'polyline';
	}

	function finishDrawingPolyline() {
		if (polylinePoints.length > 0) {
			addFeature('polyline');
		}
	}

	function startDrawingPolygon() {
		isDrawingPolygon = true;
		isDrawingPolyline = false;
		polygonPoints = [];
		clickMode = 'add';
		editingType = 'polygon';
	}

	function finishDrawingPolygon() {
		if (polygonPoints.length > 0) {
			addFeature('polygon');
		}
	}

	function cancelDrawing() {
		isDrawingPolyline = false;
		isDrawingPolygon = false;
		polylinePoints = [];
		polygonPoints = [];
		clickMode = null;
	}

	// Initialize with some example features
	$effect(() => {
		if (features.length === 0) {
			features = [
				{
					id: 'example-1',
					type: 'marker',
					latlng: [40.7128, -74.006],
					color: '#3388ff',
					fillColor: '#3388ff',
					opacity: 1,
					fillOpacity: 0.2,
					weight: 3,
					label: 'New York City'
				},
				{
					id: 'example-2',
					type: 'circleMarker',
					latlng: [40.7589, -73.9851],
					color: '#ff0000',
					fillColor: '#ff0000',
					opacity: 0.8,
					fillOpacity: 0.3,
					weight: 2,
					radius: 15,
					label: 'Times Square'
				},
				{
					id: 'example-3',
					type: 'circle',
					latlng: [40.7489, -73.9681],
					color: '#00ff00',
					fillColor: '#00ff00',
					opacity: 1,
					fillOpacity: 0.2,
					weight: 3,
					radius: 500,
					label: 'Central Park Area'
				}
			];
		}
	});
</script>

<LeafletMap
	options={{ center: [40.73, -73.95], zoom: 12 }}
	events={{ click: handleMapClick }}
>
	<TileLayer url={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`} />

	<!-- Controls -->
	<ZoomControl options={{ position: 'topright' }} />
	<ScaleControl options={{ position: 'bottomleft', imperial: false }} />
	<AttributionControl
		options={{ position: 'bottomright', prefix: 'Leaflet Sveltified Demo' }}
	/>

	<!-- Layer Groups -->
	{#if showLayerGroup}
		<LayerGroup>
			{#each features.filter((f) => f.type === 'marker' && showMarkers) as feature}
				<Marker
					latlng={feature.latlng!}
					options={{ draggable: true }}
					events={{
						click: () => {
							selectedFeatureId = feature.id;
							clickMode = 'select';
						},
						dragend: (e) => {
							updateFeature(feature.id, {
								latlng: [e.target.getLatLng().lat, e.target.getLatLng().lng]
							});
						}
					}}
				>
					{#if feature.id === selectedFeatureId}
						<Icon
							options={{
								iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
								shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
								iconSize: [38, 95],
								shadowSize: [50, 64],
								iconAnchor: [22, 94],
								shadowAnchor: [4, 62],
								popupAnchor: [-3, -76]
							}}
						/>
					{:else}
						<Icon
							options={{
								iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
								shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
								iconSize: [38, 95],
								shadowSize: [50, 64],
								iconAnchor: [22, 94],
								shadowAnchor: [4, 62],
								popupAnchor: [-3, -76]
							}}
						/>
					{/if}
					<Popup>
						<div>
							<h3>{feature.label}</h3>
							<p>Type: {feature.type}</p>
							<p>ID: {feature.id}</p>
							<button onclick={() => removeFeature(feature.id)}>Remove</button>
						</div>
					</Popup>
					<Tooltip options={{ permanent: false }}>
						{feature.label}
					</Tooltip>
				</Marker>
			{/each}
		</LayerGroup>
	{/if}

	<!-- Feature Group -->
	{#if showFeatureGroup}
		<FeatureGroup
			events={{
				click: () => {
					console.log('Feature group clicked');
				}
			}}
		>
			{#each features.filter((f) => f.type === 'circleMarker' && showCircles) as feature}
				<CircleMarker
					latlng={feature.latlng!}
					options={{
						radius: feature.radius,
						color: feature.color,
						fillColor: feature.fillColor,
						opacity: feature.opacity,
						fillOpacity: feature.fillOpacity,
						weight: feature.weight
					}}
					events={{
						click: () => {
							selectedFeatureId = feature.id;
							clickMode = 'select';
						}
					}}
				>
					<Popup>
						<div>
							<h3>{feature.label}</h3>
							<p>Radius: {feature.radius}px</p>
							<p>Color: {feature.color}</p>
							<button onclick={() => removeFeature(feature.id)}>Remove</button>
						</div>
					</Popup>
				</CircleMarker>
			{/each}

			{#each features.filter((f) => f.type === 'circle' && showCircles) as feature}
				<Circle
					latlng={feature.latlng!}
					options={{
						radius: feature.radius,
						color: feature.color,
						fillColor: feature.fillColor,
						opacity: feature.opacity,
						fillOpacity: feature.fillOpacity,
						weight: feature.weight
					}}
					events={{
						click: () => {
							selectedFeatureId = feature.id;
							clickMode = 'select';
						}
					}}
				>
					<Popup>
						<div>
							<h3>{feature.label}</h3>
							<p>Radius: {feature.radius}m</p>
							<p>Color: {feature.color}</p>
							<button onclick={() => removeFeature(feature.id)}>Remove</button>
						</div>
					</Popup>
				</Circle>
			{/each}
		</FeatureGroup>
	{/if}

	<!-- Polylines -->
	{#each features.filter((f) => f.type === 'polyline' && showPolylines) as feature}
		<Polyline
			latlngs={feature.latlngs as LatLngExpression[]}
			options={{
				color: feature.color,
				weight: feature.weight,
				opacity: feature.opacity,
				fillOpacity: feature.fillOpacity
			}}
			events={{
				click: () => {
					selectedFeatureId = feature.id;
					clickMode = 'select';
				}
			}}
		>
			<Popup>
				<div>
					<h3>{feature.label}</h3>
					<p>Points: {Array.isArray(feature.latlngs) ? feature.latlngs.length : 0}</p>
					<button onclick={() => removeFeature(feature.id)}>Remove</button>
				</div>
			</Popup>
		</Polyline>
	{/each}

	<!-- Polygons -->
	{#each features.filter((f) => f.type === 'polygon' && showPolygons) as feature}
		<Polygon
			latlngs={feature.latlngs as LatLngExpression[]}
			options={{
				color: feature.color,
				fillColor: feature.fillColor,
				weight: feature.weight,
				opacity: feature.opacity,
				fillOpacity: feature.fillOpacity
			}}
			events={{
				click: () => {
					selectedFeatureId = feature.id;
					clickMode = 'select';
				}
			}}
		>
			<Popup>
				<div>
					<h3>{feature.label}</h3>
					<p>Points: {Array.isArray(feature.latlngs) ? feature.latlngs.length : 0}</p>
					<button onclick={() => removeFeature(feature.id)}>Remove</button>
				</div>
			</Popup>
		</Polygon>
	{/each}

	<!-- Drawing helpers -->
	{#if isDrawingPolyline && polylinePoints.length > 0}
		<Polyline
			latlngs={polylinePoints}
			options={{
				color: editingColor,
				weight: editingWeight,
				opacity: 0.5,
				dashArray: '5, 5'
			}}
		/>
	{/if}

	{#if isDrawingPolygon && polygonPoints.length > 0}
		<Polygon
			latlngs={polygonPoints}
			options={{
				color: editingColor,
				fillColor: editingFillColor,
				weight: editingWeight,
				opacity: 0.5,
				fillOpacity: 0.2,
				dashArray: '5, 5'
			}}
		/>
	{/if}

	<!-- GeoJSON Example -->
	{#if showGeoJSON}
		<GeoJSON
			data={sampleGeoJSON}
			options={{
				style: {
					color: '#ff7800',
					weight: 3,
					opacity: 0.8
				},
				onEachFeature: (feature, layer) => {
					if (feature.properties && feature.properties.name) {
						layer.bindPopup(`<b>${feature.properties.name}</b>`);
					}
				}
			}}
		/>
	{/if}

	<!-- Custom DivIcon Marker Example -->
	<Marker latlng={[40.7282, -73.7949]}>
		<DivIcon
			options={{
				className: 'custom-div-icon',
				html: '<div style="background-color: #ff6b6b; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
				iconSize: [30, 30],
				iconAnchor: [15, 15]
			}}
		/>
		<Popup>
			<div>
				<h3>Custom DivIcon Marker</h3>
				<p>This marker uses a custom HTML div instead of an image</p>
			</div>
		</Popup>
		<Tooltip>Custom DivIcon</Tooltip>
	</Marker>
</LeafletMap>

<div class="control-panel">
	<div class="section">
		<h3>Add Features</h3>
		<div class="button-group">
			<button
				class:active={clickMode === 'add' && editingType === 'marker' && !isDrawingPolyline && !isDrawingPolygon}
				onclick={() => {
					clickMode = 'add';
					editingType = 'marker';
					cancelDrawing();
				}}
			>
				Add Marker
			</button>
			<button
				class:active={clickMode === 'add' && editingType === 'circleMarker' && !isDrawingPolyline && !isDrawingPolygon}
				onclick={() => {
					clickMode = 'add';
					editingType = 'circleMarker';
					cancelDrawing();
				}}
			>
				Add CircleMarker
			</button>
			<button
				class:active={clickMode === 'add' && editingType === 'circle' && !isDrawingPolyline && !isDrawingPolygon}
				onclick={() => {
					clickMode = 'add';
					editingType = 'circle';
					cancelDrawing();
				}}
			>
				Add Circle
			</button>
			<button
				class:active={isDrawingPolyline}
				onclick={() => {
					if (isDrawingPolyline) {
						finishDrawingPolyline();
					} else {
						startDrawingPolyline();
					}
				}}
			>
				{isDrawingPolyline ? 'Finish Polyline' : 'Draw Polyline'}
			</button>
			<button
				class:active={isDrawingPolygon}
				onclick={() => {
					if (isDrawingPolygon) {
						finishDrawingPolygon();
					} else {
						startDrawingPolygon();
					}
				}}
			>
				{isDrawingPolygon ? 'Finish Polygon' : 'Draw Polygon'}
			</button>
			{#if isDrawingPolyline || isDrawingPolygon}
				<button onclick={cancelDrawing}>Cancel</button>
			{/if}
		</div>
	</div>

	<div class="section">
		<h3>Feature Properties</h3>
		<div class="form-group">
			<label>Label:</label>
			<input type="text" bind:value={editingLabel} />
		</div>
		<div class="form-group">
			<label>Color:</label>
			<input type="color" bind:value={editingColor} />
		</div>
		<div class="form-group">
			<label>Fill Color:</label>
			<input type="color" bind:value={editingFillColor} />
		</div>
		<div class="form-group">
			<label>Opacity: {editingOpacity.toFixed(2)}</label>
			<input type="range" min="0" max="1" step="0.01" bind:value={editingOpacity} />
		</div>
		<div class="form-group">
			<label>Fill Opacity: {editingFillOpacity.toFixed(2)}</label>
			<input type="range" min="0" max="1" step="0.01" bind:value={editingFillOpacity} />
		</div>
		<div class="form-group">
			<label>Weight: {editingWeight}</label>
			<input type="range" min="1" max="10" step="1" bind:value={editingWeight} />
		</div>
		{#if editingType === 'circleMarker' || editingType === 'circle'}
			<div class="form-group">
				<label>Radius: {editingRadius}</label>
				<input
					type="range"
					min={editingType === 'circleMarker' ? 5 : 100}
					max={editingType === 'circleMarker' ? 50 : 5000}
					step={editingType === 'circleMarker' ? 1 : 100}
					bind:value={editingRadius}
				/>
			</div>
		{/if}
	</div>

	<div class="section">
		<h3>Edit Selected Feature</h3>
		{#if selectedFeatureId}
			{@const selected = getSelectedFeature()}
			{#if selected}
				<p><strong>{selected.label}</strong> ({selected.type})</p>
				<div class="form-group">
					<label>Label:</label>
					<input
						type="text"
						value={selected.label}
						oninput={(e) => updateFeature(selected.id, { label: (e.target as HTMLInputElement).value })}
					/>
				</div>
				<div class="form-group">
					<label>Color:</label>
					<input
						type="color"
						value={selected.color}
						oninput={(e) => updateFeature(selected.id, { color: (e.target as HTMLInputElement).value })}
					/>
				</div>
				<div class="form-group">
					<label>Fill Color:</label>
					<input
						type="color"
						value={selected.fillColor}
						oninput={(e) => updateFeature(selected.id, { fillColor: (e.target as HTMLInputElement).value })}
					/>
				</div>
				<div class="form-group">
					<label>Opacity: {selected.opacity.toFixed(2)}</label>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={selected.opacity}
						oninput={(e) => updateFeature(selected.id, { opacity: parseFloat((e.target as HTMLInputElement).value) })}
					/>
				</div>
				{#if selected.radius !== undefined}
					<div class="form-group">
						<label>Radius: {selected.radius}</label>
						<input
							type="range"
							min={selected.type === 'circleMarker' ? 5 : 100}
							max={selected.type === 'circleMarker' ? 50 : 5000}
							step={selected.type === 'circleMarker' ? 1 : 100}
							value={selected.radius}
							oninput={(e) => updateFeature(selected.id, { radius: parseInt((e.target as HTMLInputElement).value) })}
						/>
					</div>
				{/if}
				<button onclick={() => removeFeature(selected.id)}>Remove Feature</button>
			{/if}
		{:else}
			<p>No feature selected. Click on a feature to select it.</p>
		{/if}
	</div>

	<div class="section">
		<h3>Layer Visibility</h3>
		<label>
			<input type="checkbox" bind:checked={showMarkers} />
			Markers ({features.filter((f) => f.type === 'marker').length})
		</label>
		<label>
			<input type="checkbox" bind:checked={showCircles} />
			Circles ({features.filter((f) => f.type === 'circle' || f.type === 'circleMarker').length})
		</label>
		<label>
			<input type="checkbox" bind:checked={showPolylines} />
			Polylines ({features.filter((f) => f.type === 'polyline').length})
		</label>
		<label>
			<input type="checkbox" bind:checked={showPolygons} />
			Polygons ({features.filter((f) => f.type === 'polygon').length})
		</label>
		<label>
			<input type="checkbox" bind:checked={showFeatureGroup} />
			Feature Group
		</label>
		<label>
			<input type="checkbox" bind:checked={showLayerGroup} />
			Layer Group
		</label>
		<label>
			<input type="checkbox" bind:checked={showGeoJSON} />
			GeoJSON
		</label>
	</div>

	<div class="section">
		<h3>Features ({features.length})</h3>
		<div class="feature-list">
			{#each features as feature}
				<div
					class="feature-item"
					class:selected={feature.id === selectedFeatureId}
					onclick={() => {
						selectedFeatureId = feature.id;
						clickMode = 'select';
					}}
				>
					<span class="feature-type">{feature.type}</span>
					<span class="feature-label">{feature.label}</span>
					<button
						class="remove-btn"
						onclick={(e) => {
							e.stopPropagation();
							removeFeature(feature.id);
						}}
					>
						×
					</button>
				</div>
			{/each}
		</div>
	</div>

	{#if isDrawingPolyline}
		<div class="section info">
			<p>Click on the map to add points to the polyline. Click "Finish Polyline" when done.</p>
		</div>
	{/if}

	{#if isDrawingPolygon}
		<div class="section info">
			<p>Click on the map to add points to the polygon. Click "Finish Polygon" when done.</p>
		</div>
	{/if}
</div>

<style>
	.control-panel {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 300px;
		max-height: calc(100vh - 50px);
		overflow-y: auto;
		background: white;
		padding: 12px;
		z-index: 10000;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
		border-radius: 8px;
		font-size: 13px;
	}

	.section {
		margin-bottom: 15px;
		padding-bottom: 12px;
		border-bottom: 1px solid #e5e7eb;
	}

	.section:last-child {
		border-bottom: none;
	}

	.section h3 {
		margin: 0 0 8px 0;
		font-size: 15px;
		font-weight: 600;
		color: #111827;
	}

	.button-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.button-group button {
		padding: 8px 12px;
		background: #3b82f6;
		color: white;
		border: 1px solid #2563eb;
		border-radius: 6px;
		cursor: pointer;
		font-size: 13px;
		font-weight: 500;
		transition: all 0.2s;
	}

	.button-group button:hover {
		background: #2563eb;
		border-color: #1d4ed8;
	}

	.button-group button.active {
		background: #1d4ed8;
		color: white;
		border-color: #1e40af;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.form-group {
		margin-bottom: 10px;
	}

	.form-group label {
		display: block;
		margin-bottom: 5px;
		font-weight: 500;
		color: #374151;
		font-size: 13px;
	}

	.form-group input[type='text'],
	.form-group input[type='color'] {
		width: 100%;
		padding: 6px;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 13px;
	}

	.form-group input[type='color'] {
		height: 40px;
		padding: 2px;
		cursor: pointer;
	}

	.form-group input[type='range'] {
		width: 100%;
	}

	.section label {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
		cursor: pointer;
		font-size: 13px;
	}

	.section label input[type='checkbox'] {
		margin-right: 8px;
		cursor: pointer;
	}

	.feature-list {
		max-height: 150px;
		overflow-y: auto;
	}

	.feature-item {
		display: flex;
		align-items: center;
		padding: 8px;
		margin-bottom: 4px;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.feature-item:hover {
		background: #f9fafb;
		border-color: #3b82f6;
	}

	.feature-item.selected {
		background: #dbeafe;
		border-color: #3b82f6;
	}

	.feature-type {
		background: #6b7280;
		color: white;
		padding: 2px 6px;
		border-radius: 3px;
		font-size: 11px;
		margin-right: 8px;
		text-transform: uppercase;
	}

	.feature-label {
		flex: 1;
		font-size: 13px;
	}

	.remove-btn {
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		cursor: pointer;
		font-size: 16px;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.remove-btn:hover {
		background: #dc2626;
	}

	.info {
		background: #eff6ff;
		border: 1px solid #3b82f6;
		border-radius: 6px;
		padding: 10px;
	}

	.info p {
		margin: 0;
		color: #1e40af;
		font-size: 12px;
	}

	button {
		padding: 6px 12px;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 13px;
		margin-top: 8px;
	}

	button:hover {
		background: #2563eb;
	}

	:global(.custom-div-icon) {
		background: transparent;
		border: none;
	}
</style>
