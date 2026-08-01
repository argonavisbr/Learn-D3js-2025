import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as utils from "../../../../js/chart-utils.js";
import {app, data, dim} from "./common.js";

const svg = d3.select("body")
              .append("svg")
              .attr("height", dim.height)
              .attr("width", dim.width);

export function draw() { console.log(data.city)
    // EXERCISE (2) - Render temperature lines
    // ADD YOUR CODE HERE

    // Draw cartesian axes
    utils.cartesianAxes()
        .container(svg)
        .xScale(app.scale.x)
        .yScale(app.scale.y)
        .xLabel("Months")
        .yLabel("Temperature in ºC")
        .showHorizontalGrid(true)();

    const legend = svg.append("g")
        .attr("transform", `translate(${[dim.width - dim.margin.right + 10, dim.margin.top]})`);

    utils.legend()
        .container(legend)
        .data(data.city.map(d => d[0]))
        .color(app.color)();
}