import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as utils from "../../../../js/chart-utils.js";
import {app, dim, data} from "./common-1.1.js";

d3.select("#limit").text(app.limit); // update the title of the page

// The SVG container
const svg = d3.select("body").append("svg")
                             .attr("width", dim.width)
                             .attr("height",dim.height);
// The chart container, placed in the center
// EXERCISE:translate - use full height for the half-pie
const chart = svg.append("g")
                 .attr("class", "pie")
                 .attr("transform", `translate(${[dim.width/2, dim.height/2]})`);

export function draw() {
    // Bind the data the set of slices
    const slices = chart.selectAll("g.slice")
                        .data( app.pie(data.countries) )
                           .join("g")
                              .attr("class", "slice");
    // Append a path with the rendered slice
    slices.append("path")
          .attr("d", app.arc)
          .attr("fill", app.color);

    utils.pieLabels()
         .container(slices.filter(d => d.endAngle - d.startAngle > 0.05)) // Don't display in small slices
         .arc(app.arc)
         .property('gdp')
         .radius(1.52)
         .direction(utils.direction.RADIAL)
         .format(d => d3.format(",.3s")(d).replace('G','B'))();

    // EXERCISE - Add the text labels: there are two possible solutions.
    
    // 1) Using labels on slices (remove if using legends) - see the tutorial solution
    // Use utils.pieLabels() as above with the country as the property and a radius of 1.72 (to place them outside the slices)

    // 2) An alternative solution is to use legends (remove if using labels on slices)
    // a) Place the legend (a <g> container) in the top-right corner of the chart
    // b) Draw the legend (use utils.legend() from chart-utils.js) - use country names as the data
}