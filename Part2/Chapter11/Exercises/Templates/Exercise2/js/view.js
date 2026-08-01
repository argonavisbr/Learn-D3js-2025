import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {app, dim, data} from "./common.js";
import * as utils from "../../../../js/chart-utils.js";

const svg = d3.select("body")
    .append("svg")
    .attr("height", dim.height)
    .attr("width", dim.width);

export function draw() {

    // 2) Render the line here - EXERCISE
    // ADD CODE HERE
    ///////////////////////////

    // Render Cartesian axes (utility function from cartesian-chart-utils.js)
    const [,yAxis] = utils.cartesianAxes()
                          .container(svg)
                          .xScale(app.scale.x)
                          .yScale(app.scale.y)
                          .xLabel('Years')
                          .yLabel('GDP per capita (current US$)')
                          .showHorizontalGrid(true)
                          .showVerticalGrid(true)();
    yAxis.tickFormat(d3.format(".0s"));
    d3.select("g.y-axis").call(yAxis);

    // Add legend at right (utility function from cartesian-chart-utils.js)
    const legend = svg.append("g")
                      .attr("transform", `translate(${dim.width - dim.margin.right + 20}, ${dim.margin.top})`)

    utils.legend()
          .container(legend)
          .data(data.countries.map(d => d.country))
          .color(app.color)();
}