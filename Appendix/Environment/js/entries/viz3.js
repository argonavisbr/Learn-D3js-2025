import * as d3 from 'd3';
import {map, renderMap, updateMap, loadTopoJSON, createProjectionSwitcher} from '../lib/maps.js';
import * as inertia from 'd3-inertia';

map.dim = {width: 960, height: 500};
const file = './data/world-medres.topojson';
const key  = 'world';
map.projection = d3.geoMercator();
map.geoPath = d3.geoPath().projection(map.projection);

// Transform parameters
map.currentTransform = d3.zoomIdentity;
map.scale = map.projection.scale();

// Setup zoomable container in the SVG viewport as the main view
const svg = d3.select('body').append('svg')
  .attr('width', map.dim.width).attr('height', map.dim.height);
map.view = svg.append('g').attr('class', 'globe');

// Setup zoom behavior (using the mouse wheel) and connect to the view container.
const zoom = d3.zoom().filter((event) => event.type === 'wheel')
  .scaleExtent([.5,40])
  .on('zoom', evt => {
    const t = evt.transform;
    map.projection.scale(map.scale * t.k);
    t.x = map.currentTransform.x;
    t.y = map.currentTransform.y;
    updateMap();
  });
map.view.call(zoom);

// Add the inertia drag behavior for the current projection
inertia.geoInertiaDrag(map.view, updateMap, map.projection);

// Load and render the map, and setup other interactive controls
await loadTopoJSON(file, key);
renderMap(map.view);
createProjectionSwitcher((evt, projections) => {
  map.projection = projections[+evt.target.value].config;
  map.geoPath.projection(map.projection);
  updateMap();
  inertia.geoInertiaDrag(map.view, updateMap, map.projection);
});
