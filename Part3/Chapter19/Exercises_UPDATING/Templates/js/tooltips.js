import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// A module to display multi-value tooltips from properties in the feature.properties collection.
// The first line is hardwired, and should be in a 'name' property. Zero or more value lines (up to a maximum
// of MAX_LINES) are any properties in the feature.properties collection, each with a label and
// an optional formatter and optional suffix. The formatter is a d3.format function (default copies the data).
//
// To use, first call create(svg, data) to create the tooltip. data is optional.
// Then call show(evt, d) to show the tooltip for a feature, and hide() to hide it.

const MAX_LINES = 5;    // up to five data lines can be displayed in the tooltip
const lineHeight = 15;

let tooltipFields = [];

const dataString = (d, field) => `${field.label}: ${field.formatter(d.properties[field.property])}${field.suffix ? field.suffix : ''}`;

function setDataStrings(data) {
    tooltipFields = data.map(({ property, label, formatter = d => d, suffix = "" }) => ({
        property, label, formatter, suffix
    }));
}

// lines: the number of data lines to display (1 to MAX_LINES).
// data: an array of { property, label, formatter } objects, one per data line.
export function create(svg, data = []) {
    const lines = data.length;
    if (lines > MAX_LINES) {
        throw new Error(`tooltips.js: 'The tooltip can have up to ${MAX_LINES} value line(s) (got ${lines}).`);
    }
    if(lines > 0) {
        setDataStrings(data.slice(0, lines));
    }

    const height = 20 + lines * lineHeight; // grows with the number of data lines

    const tooltip = svg.append("g").attr("id", "tooltip").style("opacity", 0) // hidden
    tooltip.append("rect")
            .attr("width", 150).attr("height", height)
            .attr("rx", 5).attr("ry", 5)
            .attr("x", -75).attr("y", lines === 0 ? -14 : -20)
    tooltip.append("text")
           .attr("y", lines === 0 ? 0 : -7)
           .attr("class", "title") // A title line (hardwired for feature.properties.name)
    tooltip.selectAll("text.data")
        .data(tooltipFields)
        .join("text")
            .attr("class", "data")
            .attr("y", (d, i) => 10 + i * lineHeight);
}

function readjustTooltipWidth() {
    const tooltip = d3.select("#tooltip");

    const maxWidth = d3.max(
        tooltip.selectAll("text").nodes(),
        text => text.getBBox().width
    );

    const width = maxWidth + 20;

    tooltip.select("rect")
        .attr("width", width)
        .attr("x", -width / 2); // keeps the rectangle centered
}

export function show(evt, d) {
    const tooltip = d3.select("#tooltip")
        .attr("transform", `translate(${d3.pointer(evt)})`)
        .style("opacity", 1);

    tooltip.select("text.title")
        .text(d.properties.name);

    tooltip.selectAll("text.data")
        .data(tooltipFields)
        .text(field => dataString(d, field));

    readjustTooltipWidth();
}

export function hide() {
    d3.select("#tooltip").style("opacity", 0)
}
