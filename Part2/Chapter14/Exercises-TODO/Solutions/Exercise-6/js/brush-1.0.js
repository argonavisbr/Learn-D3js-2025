import * as d3 from 'https://cdn.skypack.dev/d3@7';
import {app} from './common-1.5.js';
import {isValid, inBrush} from '../../../../js/brush-utils.js';

export {setup};

function setup() {
    d3.select("#chart svg")
        .append("g")
        .attr("class", "container")
            .datum([]);     // bind an empty selection to the container

    app.brush
        .on("brush", function(evt, data) {
            if (!isValid(evt)) return;
            // store selected data in container
            d3.select(this)
                .datum(app.data.countries
                          .filter(d => inBrush(evt.selection,[app.scale.x(d.hdi), app.scale.y(d.gdp)])));
            d3.selectAll(".dot")
                .style("fill", d => data.includes(d) ? "black" : app.color(d.continent));
        })
        .on("end", function(evt, data) {
            if (!isValid(evt)) return;
            if(data.length > 0) {
                rescale(evt.selection);
                updateView();
            }
            d3.selectAll(".dot")
                .style("fill", d => app.color(d.continent));   // Reset color of selected circles
        });

    d3.select(".container").call(app.brush);
}

// Rescale the chart based on the brush selection
function rescale([start, end]) {
    // get domain values from the selection
    const x0 = app.scale.x.invert(start[0]);
    const y1 = app.scale.y.invert(start[1]);  // inverse direction for y
    const x1 = app.scale.x.invert(end[0]);
    const y0 = app.scale.y.invert(end[1]);    // inverse direction for y

    // update the scale domains
    app.scale.x.domain([x0, x1]);
    app.scale.y.domain([y0, y1]);
}

function updateView() {
    d3.select(".x-axis").transition().call(app.axis.x);
    d3.select(".y-axis").transition().call(app.axis.y);

    // update positions with new scale and remove the circles that are outside the range
    d3.selectAll(".dot").transition()
        .attr("cx", d => app.scale.x(d.hdi))
        .attr("cy", d => app.scale.y(d.gdp))
        .filter(d => !d3.select(".container").datum().includes(d))
        .remove();

    d3.select(".container").call(app.brush.clear);  // clear the brush selection
}