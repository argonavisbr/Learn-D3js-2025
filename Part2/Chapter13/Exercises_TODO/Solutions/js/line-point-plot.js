import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as utils from "../../../js/chart-utils.js";

// EXERCISE 13.8: the solution is the implementation of the animateLabels function below,
// which creates animated SVG textPath for each item (<textPath href='#line-city'><animate>...</animate></textPath>)
// See labeled comments.

/**
 * Plots cartesian line chart with points in x-axis
 * @param container
 * @param dim
 * @param data
 * @param points
 * @param labels
 * @param animLabels If true animates labels, otherwise adds a legend
 */
export function plotCartesian(container, dim, data, points, labels, animLabels = false) {
    const scaleX = d3.scalePoint()
        .range([dim.margin.left, dim.width - dim.margin.right])
        .domain(points);

    const scaleY = d3.scaleLinear()
        .range([dim.height - dim.margin.bottom, dim.margin.top])
        .domain([d3.min(data.map(d => d[1]).flat()) - 5,
            d3.max(data.map(d => d[1]).flat()) + 5]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Line functions
    const line = d3.line()
        .x((d,i) => scaleX(points[i]))
        .y(d => scaleY(d))
        .curve(d3.curveCatmullRom);

    // Render chart

    // Render the lines (<path>) for each item
    container.selectAll("g.line")
        .data(data)
        .join("g")
        .attr("class", "line")
        .append("path")
        .attr("id", d => `line-${d[0].split(" ")[0]}`)
        .datum(d => d[1])
        .attr("class", "steps")
        .attr("d", line)
        .style("stroke", (d,i) => color(i));

    utils.cartesianAxes()
        .container(container)
        .xScale(scaleX)
        .yScale(scaleY)
        .xLabel(labels.x)
        .yLabel(labels.y)
        .showHorizontalGrid(true)();

    if (animLabels) {
        animateLabels(dim, container, data, color); // Call the animateLabels function to add animated labels along the lines
    } else {
        showLegend(dim, container, data, color); // Call the showLegend function to add a static legend
    }

}

/**
 * Adds a static legend to the chart
 * @param dim
 * @param container
 * @param data
 * @param color
 */
function showLegend(dim, container, data, color) {
    const leg = container.append("g")
        .attr("transform", `translate(${[dim.width - dim.margin.right + 10, dim.margin.top]})`);
    utils.legend()
        .container(leg)
        .data(data.map(d => d[0]))
        .color(color)();
}

// EXERCISE 13.8: the solution is the implementation of the animateLabels function below.
/**
 * Creates animated SVG textPath for each item
 * (<textPath href='#line-city'><animate>...</animate></textPath>)
 * @param dim
 * @param container
 * @param data
 * @param color
 */
function animateLabels(dim, container, data, color) {
    container.selectAll("text.anim")
             .data(data)
               .join("text") // <text>
                 .attr("class", "anim")
                 .attr("x", 100)
                 .attr("dy", -10)
                 .style("fill", (d,i) => color(i))
                 .append("textPath") // Adding a <textPath href='#line-city'> so the baseline adjusts to the line
                    .attr("startOffset", "-25%")
                    .attr("href", d => `#line-${d[0].split(" ")[0]}`)
                    .text(d => d[0])
                    .append("animate") // Adding an SVG <animate> tag, to animate the startOffset attribute of the textPath, so the label moves along the line
                        .attr("attributeName", "startOffset")
                        .attr("from", "-25%")
                        .attr("to", "90%")
                        .attr("begin", (d,i) => `${i*.5}s`)
                        .attr("dur", "10s")
                        .attr("repeatCount", "indefinite");
}
