import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../../../css/fonts.css';

export default function Viz2() {
  const ref = useRef(null);

  useEffect(() => {
    const root = d3.select(ref.current);
    root.selectAll('*').remove();

    const dataFile = './data/un_regions.csv';

    const width = 1000;
    const height = 650;
    const margin = 60;

    const color = d3.scaleSequential(d3.interpolateCool);
    const radius = d3.scaleSqrt().range([5, 90]);
    const nodeDragged = d3.drag();

    let sim = null;

    d3.csv(dataFile, row => ({ Country: row.Country, Population: +row.Pop_2016 }))
      .then(nodes => {
        color.domain([0, nodes.length]);
        radius.domain(d3.extent(nodes, d => d.Population));

        const svg = root.append('svg').attr('width', width).attr('height', height);
        const chart = svg.append('g').attr('transform', `translate(${[width / 2, margin / 4 + height / 2]})`);

        sim = d3.forceSimulation(nodes)
          .force('manybody', d3.forceManyBody().strength(50))
          .force('center', d3.forceCenter())
          .force('y', d3.forceY().strength(.1))
          .force('collide', d3.forceCollide(d => radius(d.Population) + 1)
            .strength(2)
            .iterations(10));

        sim.on('tick', () => {
          chart.selectAll('.bubble').attr('transform', d => `translate(${[d.x, d.y]})`);
        });

        nodeDragged
          .on('drag', function (evt, d) {
            d.x = evt.x;
            d.y = evt.y;
          })
          .on('start', function () {
            if (sim.alpha() <= sim.alphaMin()) {
              sim.restart();
            }
            sim.alphaTarget(sim.alphaMin() + .1)
          })
          .on('end', () => sim.alphaTarget(0));

        const bubbles = chart.selectAll('g.bubble')
          .data(nodes).join('g')
          .append('g').attr('class', 'bubble')
          .attr('transform', d => `translate(${[d.x, d.y]})`)
          .call(nodeDragged);

        bubbles.append('circle')
          .attr('r', d => radius(d.Population))
          .style('fill', (d, i) => d3.rgb(color(i)).darker(.75))
          .style('fill-opacity', .8);

        bubbles.append('text')
          .text(d => d.Country)
          .attr('y', d => radius(d.Population) / 9)
          .attr('font-size', function (d) {
            const size = Math.min(3 * radius(d.Population), (3 * radius(d.Population) - 8) / this.getComputedTextLength() * 9);
            if (size > 7) {
              return size + 'px';
            }
            return 0;
          });
      });

    return () => {
      if (sim) {
        sim.stop();
      }
      root.selectAll('*').remove();
    };
  }, []);

  return (
    <div className="viz2">
      <h3>Force-directed bubble chart</h3>
      <div ref={ref} />
    </div>
  );
}
