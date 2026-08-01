import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function Viz5() {
  const ref = useRef(null);

  useEffect(() => {
    const root = d3.select(ref.current);
    root.selectAll('*').remove();

    // Controls UI
    const header = root.append('h4').text('d3.scaleBand()');
    const panel = root.append('div');

    const row1 = panel.append('p');
    row1.html('<code>domain()</code> <code id="domain"></code><br/><code>range()</code> <code id="range"></code>');

    const row2 = panel.append('p');
    row2.html(`
      <code>paddingInner()</code> <input id="pi" type="range" value="0" min="0" max="1" step=".01"> <code id="piv"></code><br/>
      <code>paddingOuter()</code> <input id="po" type="range" value="0" min="0" max="10" step=".1"> <code id="pov"></code><br/>
      <code>align()</code> <input id="align" type="range" value="0.5" min="0" max="1" step=".01"> <code id="alignv"></code>
    `);

    const row3 = panel.append('p');
    row3.html('<code>step()</code> <code id="step"></code><br/><code>bandwidth()</code> <code id="bandwidth"></code>');

    // SVG
    const svg = root.append('svg').attr('height', 650).attr('width', 850);
    const gBars = svg.append('g').attr('transform', 'translate(10,0)');
    const gAxis = svg.append('g').attr('id', 'x-axis').attr('transform', 'translate(10,20)');

    // Data and scales
    const data = d3.range(0, 100, 10);
    const scale = d3.scaleBand().domain(data).range([0, 800]);
    const colorScale = d3.scaleSequential(d3.interpolatePlasma).domain([0, 200]);

    // Fixed height for bars
    gBars.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('y', 22)
        .attr('height', () => Math.random() * 200)

    // Formatters
    const per = d3.format('.0%');
    const fmt = d3.format('.2f');

    // Bind controls
    const sel = {
      domain: panel.select('#domain'),
      range: panel.select('#range'),
      pi: panel.select('#pi'), piv: panel.select('#piv'),
      po: panel.select('#po'), pov: panel.select('#pov'),
      align: panel.select('#align'), alignv: panel.select('#alignv'),
      step: panel.select('#step'), bandwidth: panel.select('#bandwidth')
    };

    // Initialize texts
    function refreshLabels() {
      sel.domain.text(`[${scale.domain()}]`);
      sel.range.text(`[${scale.range()}]`);
      sel.piv.text(`${scale.paddingInner()}`);
      sel.pov.text(`${scale.paddingOuter()}`);
      sel.alignv.text(`${scale.align()}`);
      sel.step.text(`${fmt(scale.step())}`);
      sel.bandwidth.text(`${fmt(scale.bandwidth())}`);
    }

    function updateBars() {
      gBars.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => (scale(d) ?? 0))
        .attr('width', scale.bandwidth())
        .attr('fill', function () {
          const h = +d3.select(this).attr('height');
          return colorScale(h);
        });

      const xAxis = d3.axisTop(scale);
      gAxis.call(xAxis);
    }

    function update() {
      updateBars();
      refreshLabels();
    }

    // Event listeners
    sel.pi.node().addEventListener('input', function () {
      scale.paddingInner(+this.value);
      sel.piv.text(`${scale.paddingInner()} (${per(scale.paddingInner())} of step)`);
      sel.step.text(`${fmt(scale.step())}`);
      sel.bandwidth.text(`${fmt(scale.bandwidth())}`);
      update();
    });

    sel.po.node().addEventListener('input', function () {
      scale.paddingOuter(+this.value);
      sel.pov.text(`${scale.paddingOuter()} step(s)`);
      sel.step.text(`${fmt(scale.step())}`);
      sel.bandwidth.text(`${fmt(scale.bandwidth())}`);
      update();
    });

    sel.align.node().addEventListener('input', function () {
      scale.align(+this.value);
      sel.alignv.text(`${scale.align()}  (${per(scale.align())})`);
      update();
    });

    // Initial render
    update();
    // Trigger inputs to populate live values
    panel.selectAll('input').dispatch('input');

    return () => {
      root.selectAll('*').remove();
    };
  }, []);

  return (
    <div>
      <h3>Band scale</h3>
      <div ref={ref} />
    </div>
  );
}
