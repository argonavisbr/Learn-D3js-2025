import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as inertia from 'd3-inertia';
import { map, renderMap, updateMap, loadTopoJSON, createProjectionSwitcher } from '../../lib/maps.js';

export default function Viz3() {
  const ref = useRef(null);

  useEffect(() => {
    const root = d3.select(ref.current);
    root.selectAll('*').remove();

    // Local container elements
    const svg = root.append('svg').attr('width', 960).attr('height', 500);
    const switcher = root.append('div').attr('id', 'switcher').style('marginTop', '8px');

    // Configure shared map singleton for this render
    map.dim = { width: 960, height: 500 };
    map.projection = d3.geoMercator();
    map.geoPath = d3.geoPath().projection(map.projection);
    map.view = svg.append('g').attr('class', 'globe');
    map.onAfterDraw = null;

    // Zoom behavior (wheel only) into the view group
    const baseScale = map.projection.scale();
    const zoom = d3.zoom().filter((event) => event.type === 'wheel')
      .scaleExtent([.5, 40])
      .on('zoom', evt => {
        const t = evt.transform;
        map.projection.scale(baseScale * t.k);
        updateMap();
      });
    map.view.call(zoom);

    // Inertia drag
    inertia.geoInertiaDrag(map.view, updateMap, map.projection);

    let destroyed = false;

    async function start() {
      await loadTopoJSON('./data/world-medres.topojson', 'world');
      if (destroyed) return;
      renderMap(map.view);
      createProjectionSwitcher((evt, projections) => {
        map.projection = projections[+evt.target.value].config;
        map.geoPath.projection(map.projection);
        updateMap();
        inertia.geoInertiaDrag(map.view, updateMap, map.projection);
      });
    }

    start();

    return () => {
      destroyed = true;
      // Remove any listeners attached by inertia/zoom by removing the svg
      root.selectAll('*').remove();
    };
  }, []);

  return (
    <div>
      <h3>Globe rotation with d3.geoInertiaDrag</h3>
      <div ref={ref} />
    </div>
  );
}
