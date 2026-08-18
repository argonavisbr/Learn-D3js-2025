import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as utils from "../../../js/chart-utils.js";

// EXERCISE 13.8: this exercise explores SVG animations. Implement the animateLabels function below,
// to use the chart's lines as the baselines for the labels with city names (add <textPath href='#line-city'>...<textPath>
// as a child element to each <text> element. Then and add an SVG <animate>...</animate> block as the child
// element of <textPath> to animate the startOffset attribute of the textPath. This will make the label move
// along the line).
// See labeled comments in the animateLabels() function.

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

    // Render the lines (<path>) for each item
    // Note that each line receives an id attribute.
    // Spaces in the words were removed (and they also need to be removed when referencing the ID)
    container.selectAll("g.line")
        .data(data)
          .join("g")
            .attr("class", "line")
            .append("path")
              .attr("id", d => `line-${d[0].split(" ")[0]}`) // An id for each line, so we can reference it in the <textPath href='#line-city'> element
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
        showLegend(dim, container, data, color); // Call the showLegend function to add a legend
    }

}

function showLegend(dim, container, data, color) {
    const legContainer = container.append("g")
                                  .attr("transform", `translate(${[dim.width - dim.margin.right + 10, dim.margin.top]})`);
    utils.legend()
        .container(legContainer)
        .data(data.map(d => d[0]))
        .color(color)();
}

// EXERCISE 13.8: Implement the animateLabels function below.
/**
 * Creates animated SVG textPath for each item
 * (<textPath href='#line-city'><animate>...</animate></textPath>)
 * @param dim
 * @param container
 * @param data
 * @param color
 */
function animateLabels(dim, container, data, color) {
    // Replace the static legend with animated labels along the lines.
    // Each label should move along the line using an SVG <animate> tag.

    showLegend(dim, container, data, color); // Remove this line when you implement the animated labels.

    // Use D3 to add three nested elements, which will animate the labels. Use a single chained expression.
    // 1) Create the labels: select the text elements of class 'anim' in the container and bind the data to them.
    // Use join() to create a <text> element for each data item. Use the line color to fill the text.

    // 2) Append a <textPath> element to each <text> element, with the href attribute pointing to the corresponding
    // line's id (use the data's first element, which is the city name, and remove the spaces to match the line's id).
    // Set the startOffset attribute to position the text along the line use -25%).
    // Use the city's name as the text content.

    // 3) Finally, append an <animate> element to each <textPath> to animate the startOffset attribute from -25% to 90% over 10 seconds,
    // with a staggered start time for each label (use the index to calculate the begin time, e.g., `${i * 0.5}s`).
    // Use repeatCount="indefinite" to make the animation loop indefinitely.

}
