import * as d3 from 'https://cdn.skypack.dev/d3@7';
import {dim, app} from './common-1.5.js';
import {drawLegend} from './legend-1.0.js';
import * as tooltip from './tooltips-1.0.js';
import * as zoom from './zoom-1.0.js';

export function draw() {
    d3.select("#chart")
        .append("svg").attr("id", "top-svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${dim.w} ${dim.h}`);


    drawLegend();    // must be below brush container
    drawChart();     // chart objects trigger tooltip events first
    drawAxes();      // must be below brush container
    tooltip.draw();  // tooltip boxes declare pointer-events:none (events pass through)
    zoom.setup();    // setup the zooming feature
}

function drawChart() {

    d3.select("#top-svg")
        .append("g") // adding a group to translate the nested svg element
        .attr("transform", `translate(${[dim.margin.w, dim.margin.h]})`)
      .append("svg") // adding a nested svg element for zooming
        .attr("class", "view")
        .attr("width", dim.w - dim.margin.w*2)
        .attr("height", dim.h - dim.margin.h*2)
        .append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "orange").attr("opacity", .1)

    d3.select("#top-svg .view")
        .append("g")
          .selectAll("circle.dot")
            .data(app.data.countries)
              .join("circle")
                .attr("class", "dot")
                .attr("r", dim.radius)
                .attr("cx", d => app.scale.x(d.hdi))
                .attr("cy", d => app.scale.y(d.gdp))
                .style("fill", d => app.color(d.continent))
                .on("pointerenter", tooltip.show)                  // added for tooltip events
                .on("pointerleave", tooltip.clear);
}

function drawAxes() {
    d3.select("#top-svg g")
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(${[0, -dim.margin.h/2]})`)
        .call(app.axis.x);

    d3.select("#top-svg g")
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${[390, 0]})`)
        .call(app.axis.y);

    d3.select("#top-svg g")
        .append("text")
        .attr("class","label")
        .text("Human Development Index (HDI)")
        .attr("transform", `translate(${[dim.w/2, dim.h - 3]})`)

    d3.select("#top-svg g")
        .append("text")
        .attr("class","label")
        .text("Annual GDP per capita (International USD)")
        .attr("transform", `translate(${[3, dim.h/2]}) rotate(90)`)
}