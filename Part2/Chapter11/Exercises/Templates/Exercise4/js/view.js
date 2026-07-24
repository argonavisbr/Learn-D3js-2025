import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as utils from "../../../../js/chart-utils.js";
import {app, data, dim} from "./common.js";

const svg = d3.select("body")
    .append("svg")
    .attr("height", dim.height)
    .attr("width", dim.width);

export function draw() {
    const chart = svg.append("g");

    // EXERCISE (2) - render the area, baseline, topline and average line
    // ADD YOUR CODE HERE

    utils.cartesianAxes()
        .container(chart)
        .xScale(app.scale.x)
        .yScale(app.scale.y)
        .xLabel("Month")
        .yLabel("Rainfall (mm)")
        .showHorizontalGrid(true)();

    const legend = svg.append("g")
        .attr("transform", `translate(${dim.width - dim.margin.right}, ${dim.margin.top})`);
    utils.legend()
        .container(legend)
        .color(app.color)
        .data(["Record minimum", "Median", "Record maximum"])();
}