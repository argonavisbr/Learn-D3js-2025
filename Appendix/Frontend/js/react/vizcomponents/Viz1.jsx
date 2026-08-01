import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as utils from '../../lib/chart-utils.js';
import { isValid } from '../../lib/brush-utils.js';

export default function Viz1() {
  const ref = useRef(null);

  useEffect(() => {
    const root = d3.select(ref.current);
    root.selectAll('*').remove();

    // Build local DOM structure expected by the original code
    const info = root.append('p');
    info.html(
      'Selected points: <span id="population">0</span> (<span id="percent">0%</span> of the population<span id="detail"></span>)'
    );
    const hist = root.append('svg').attr('id', 'histogram');
    const scatter = root.append('svg').attr('id', 'scatterplot');

    // Original logic adapted to scope within this container
    const data1 = d3.range(5000).map(() => ({
      x: d3.randomNormal(50, 7)(),
      y: d3.randomNormal(50, 8)(),
      n: d3.randomNormal(20, 10)()
    }));
    const data2 = d3.range(2500).map(() => ({
      x: d3.randomUniform(0, 100)(),
      y: d3.randomUniform(0, 100)(),
      n: d3.randomNormal(60, 6)()
    }));
    const data = data1.concat(data2).filter(d => d.n > 0);

    const dim = { width: 500, height: 400, margin: 50 };
    const cht = { width: dim.width - 2 * dim.margin, height: dim.height - 2 * dim.margin };

    const scatterState = {
      context: scatter.attr('width', dim.width).attr('height', dim.height)
        .append('g').attr('transform', `translate(${dim.margin}, ${dim.margin})`),
      x: d3.scaleLinear().domain([0, 100]).range([0, cht.width]),
      y: d3.scaleLinear().domain([0, 100]).range([cht.height, 0])
    };
    scatterState.chart = scatterState.context.append('svg')
      .attr('width', cht.width)
      .attr('height', cht.height);
    scatterState.container = scatterState.chart.append('g');

    // Background for zoom
    scatterState.container.append('rect')
      .attr('width', cht.width)
      .attr('height', cht.height)
      .style('fill', 'white')
      .style('pointer-events', 'all');

    // Axes
    const axes = utils.cartesianAxes()
      .container(scatterState.context)
      .xScale(scatterState.x)
      .yScale(scatterState.y)();
    [scatterState.axisX, scatterState.axisY] = axes;

    // Points
    scatterState.container.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => scatterState.x(d.x))
      .attr('cy', d => scatterState.y(d.y))
      .attr('r', 1.5);

    // Histogram
    const histogram = {
      svg: hist.attr('width', dim.width).attr('height', dim.height),
      x: d3.scaleBand().range([dim.margin, dim.width - dim.margin]),
      y: d3.scaleLinear().range([dim.height - dim.margin, dim.margin]),
      color: d3.scaleLinear().range(['orange', 'blue'])
    };

    const bins = d3.bin().thresholds(data.length / 50)(data.map(d => d.n));

    histogram.x.domain(bins.map(d => d.x0));
    histogram.y.domain([0, d3.max(bins, d => d.length)]);
    histogram.color.domain(d3.extent(bins, d => d.x0));

    // Axes for histogram
    const [hAxisX] = utils.cartesianAxes().container(histogram.svg)
      .xScale(histogram.x)
      .yScale(histogram.y)
      .yLabel('Population')
      .xLabel('Value')();
    hAxisX.tickValues(histogram.x.domain().filter((d, i) => i % 10 === 0)).tickFormat(d3.format('d'));
    histogram.svg.select('.x-axis').call(hAxisX);

    // Bars
    histogram.container = histogram.svg.append('g').datum(bins);
    histogram.container.selectAll('.bar')
      .data(d => d)
      .join('rect').attr('class', 'bar')
      .attr('x', d => histogram.x(d.x0))
      .attr('y', d => histogram.y(d.length))
      .attr('width', histogram.x.bandwidth())
      .attr('height', d => histogram.y(0) - histogram.y(d.length))
      .attr('fill', d => histogram.color(d.x0));

    // Brush
    const brushed = (bin, sel) => histogram.x(bin.x0) >= sel[0] && histogram.x(bin.x1) <= sel[1];
    const brush = d3.brushX()
      .extent([[dim.margin, dim.margin], [dim.width - dim.margin, dim.height - dim.margin]])
      .on('start', function () {
        root.selectAll('.bar').style('fill', null);
        root.select('#population').text(0);
        root.select('#percent').text('0%');
        root.select('#detail').text('');
        scatterState.container.selectAll('circle').style('fill', 'black');
      })
      .on('brush end', function (evt) {
        if (!isValid(evt)) return;
        const selectedData = bins.filter(bin => brushed(bin, evt.selection));
        if (selectedData && selectedData.length > 0) {
          root.selectAll('.bar').style('fill', bin => selectedData.includes(bin) ? 'red' : null);
          showStats(selectedData);
          showInPlot(selectedData);
        }
      });
    histogram.container.call(brush);

    // Zoom for scatter
    const zextent = [[0, 0], [cht.width, cht.height]];
    const zoom = d3.zoom()
      .extent(zextent)
      .translateExtent(zextent)
      .scaleExtent([1, 100])
      .on('zoom', evt => {
        scatterState.container.attr('transform', evt.transform)
          .selectAll('circle')
          .attr('r', 1.5 / evt.transform.k);
        root.select('#k').text(d3.format('.2f')(evt.transform.k));
        scatterState.axisX.scale(evt.transform.rescaleX(scatterState.x));
        scatterState.axisY.scale(evt.transform.rescaleY(scatterState.y));
        scatter.select('.x-axis').call(scatterState.axisX);
        scatter.select('.y-axis').call(scatterState.axisY);
      });
    scatterState.chart.call(zoom);

    function showStats(selectedData) {
      const [min, max] = [selectedData[0].x0, selectedData[selectedData.length - 1].x1];
      root.select('#detail').html(` from <i>n</i>=${min} to <i>n</i>=${max}`);
      const population = selectedData.map(d => d.length).reduce((a, b) => a + b);
      root.select('#population').text(population);
      const percent = d3.format('.2%')(population / data.length);
      root.select('#percent').text(percent);
    }

    function showInPlot(selectedData) {
      const allPoints = scatterState.container.selectAll('circle')
        .style('fill', 'black');
      const [min, max] = [selectedData[0].x0, selectedData[selectedData.length - 1].x1];
      allPoints.filter(d => d.n >= min && d.n <= max).raise()
        .style('fill', 'red');
    }

    return () => {
      root.selectAll('*').remove();
    };
  }, []);

  return (
    <div>
      <h3>Brush select with zoom</h3>
      <div ref={ref} />
    </div>
  );
}
