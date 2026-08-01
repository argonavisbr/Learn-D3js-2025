import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as utils from '../../lib/chart-utils.js';

export default function Viz4() {
  const ref = useRef(null);

  useEffect(() => {
    const root = d3.select(ref.current);
    root.selectAll('*').remove();

    const dim = { width: 600, height: 600, margin: 30 };
    const file = './data/GLB.Ts.1880.2025.csv';

    const svg = root.append('svg').attr('width', dim.width).attr('height', dim.height);
    const chart = svg.append('g').attr('transform', `translate(${dim.width / 2},${dim.height / 2})`);

    let destroyed = false;

    async function start() {
      const csv = await d3.csv(file, d3.autoType);
      if (destroyed) return;

      const months = csv.columns.slice(1);
      const years = csv.map(obj => [obj.Year, months.map(m => [m, obj[m]])]);
      years.forEach((d, i) => d[1].push(years[i + 1] ? years[i + 1][1][0] : d[1][d[1].length - 1]));

      const angle = d3.scaleLinear().domain([0, months.length]).range([0, 2 * Math.PI]);
      const series = years.map(d => d[1].map(v => v[1]));
      const temperatures = series.flat();
      const radius = d3.scaleLinear().domain([d3.min(temperatures) - .2, d3.max(temperatures) + .1]).range([0, dim.width / 2 - dim.margin]);
      const color = d3.scaleSequential(d3.interpolateTurbo).domain(d3.extent(series.map(d => d3.mean(d))));

      const line = d3.lineRadial()
        .angle((_, i) => angle(i))
        .radius(d => radius(d[1]))
        .defined(d => d[1] && !isNaN(d[1]))
        .curve(d3.curveCatmullRom);

      // Draw temperature lines
      chart.selectAll('g.line')
        .data(years)
        .join('g')
        .attr('class', 'line')
        .append('path')
        .datum(d => d[1])
        .attr('class', 'months')
        .attr('d', line)
        .style('fill', 'none')
        .style('stroke', d => color(d3.mean(d.map(v => v[1]))))
        .style('stroke-width', 1.5)
        .style('opacity', .9);

      // Radial axes
      utils.radialAxes().container(chart)
        .aScale(angle)
        .rScale(radius)
        .angularData(months)
        .numTicks(10)
        .useGrid(true)
        .backdropOpacity(.9)();

      // Events
      chart.selectAll('g.line')
        .on('mouseover', function (event, d) {
          const [x, y] = d3.pointer(event);
          const selectedLine = d3.select(event.target);

          chart.append('text')
            .attr('class', 'year')
            .attr('x', x + 10)
            .attr('y', y + 10)
            .text(d[0])
            .attr('fill', d3.color(color(d3.mean(d[1].map(v => v[1])))).darker().darker());

          chart.selectAll('g.line path')
            .style('opacity', .35);

          selectedLine.style('stroke-width', 5)
            .style('opacity', 1);
        })
        .on('mouseout', function () {
          chart.selectAll('text.year').remove();
          chart.selectAll('g.line path')
            .style('stroke-width', null)
            .style('opacity', null);
        });
    }

    start();

    return () => {
      destroyed = true;
      root.selectAll('*').remove();
    };
  }, []);

  return (
    <div>
      <h3>Global temperatures 1880–2025 — spiral</h3>
      <div ref={ref} />
    </div>
  );
}
