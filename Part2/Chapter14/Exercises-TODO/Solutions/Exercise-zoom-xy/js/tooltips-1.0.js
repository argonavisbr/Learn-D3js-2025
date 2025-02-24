import * as d3 from 'https://cdn.skypack.dev/d3@7';
import {app, dim} from './common-1.5.js';

export {draw, show, clear};

const fields = [
    {field: "name", text: d => d.name},
    {field: "gdp", text: d => "GDP: " + app.format.gdp(d.gdp)},
    {field: "hdi", text: d => "HDI: " + d.hdi}
];

const padding = 3;
const lineH = 15;

// tooltips
function draw() {
    const tooltip = d3.select("svg.view")
                      .append("g")
                        .attr("class", "tooltip")
                        .attr("opacity", 0);

    tooltip.append("rect")
           .attr("width", 80)
           .attr("height", fields.length * lineH)
           .attr("rx", 3)
           .attr("ry", 3)
           .attr("x", -padding)
           .attr("y", -padding);

    tooltip.selectAll("text")
        .data(fields.map(f => f.field))
        .join("text")
        .attr("class", d => d)
        .attr("y", (d, i) => i * lineH);
}

function show(event, d) {

    const xs = dim.currentZoom.rescaleX(app.scale.x); // semantic zoom
    const ys = dim.currentZoom.rescaleY(app.scale.y);

    const position = [xs(d.hdi) + 7,
                      ys(d.gdp) + padding - fields.length * lineH/2];

    d3.select(".tooltip")
        .attr("opacity", 1)
    d3.select(".tooltip")
        .attr("transform", `translate(${position})`)

    d3.select(event.target)
        .attr("r", dim.radius * 2);

    fields.forEach(f => d3.select(".tooltip ." + f.field)
                              .text(f.text(d)));

    const lengths = d3.selectAll(".tooltip text")
                      .nodes()
                      .map(t => t.getComputedTextLength());

    const boxWidth = d3.max(lengths) + padding * 2;

    d3.select(".tooltip rect")
        .attr("width", boxWidth);
}

function clear(event) {
    d3.select(event.target).attr("r", dim.radius);
    d3.select(".tooltip")
        .attr("opacity", 0)
}