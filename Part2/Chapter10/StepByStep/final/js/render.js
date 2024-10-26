import * as d3 from 'https://cdn.skypack.dev/d3@7';

import * as pkt from '../../../js/cartesian-axes-esm.js';

import {dim, app} from './constants.js';
import {drawLegend} from './legend.js';
import * as tooltip from './tooltips.js';

export function draw() {
    d3.select("#chart")
        .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${dim.w} ${dim.h}`);

    drawAxes();
    drawChart();
    drawLegend();
    tooltip.draw();
}

function drawChart() {
    d3.select("svg")
      .selectAll("circle.dot")
        .data(app.data.countries)
          .join("circle").attr("class", "dot")
            .attr("r", d => app.scale.r(d.pop))  // added variable radius
            .attr("cx", d => app.scale.x(d.hdi))
            .attr("cy", d => app.scale.y(d.gdp))
            .style("fill", d => app.color(d.continent))
            .on("mouseenter", tooltip.show)                  // added for tooltip events
            .on("mouseleave", tooltip.clear);
}

function drawAxes() {
    pkt.cartesianAxes().context(d3.select("svg"))
        .xScale(app.scale.x)
        .yScale(app.scale.y)
        .xLabel('Human Development Index (HDI)')
        .yLabel('Annual GDP per capita (International USD)')
        .showHorizontalGrid(true)
        .showVerticalGrid(true)();
}