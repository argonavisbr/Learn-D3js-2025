import * as d3 from 'https://cdn.skypack.dev/d3@7';
import {app, dim} from './common-1.5.js';

export {setup};

// Button to reset zoom
d3.select("body").append("button").attr("id", "zoom-reset").text("Reset Zoom")
    .on("click", function() {
        this.style.opacity = 0;
        d3.select("#top-svg").transition().duration(750)
            .call(app.zoom.transform, d3.zoomIdentity);
        dim.currentZoom = d3.zoomIdentity;
        dim.radius = 2;
    });

function setup() {
    app.zoom
        .on('zoom', function(evt) {
            // calculate new zoom transform
            dim.currentZoom = evt.transform;

            const xs = dim.currentZoom.rescaleX(app.scale.x);
            const ys = dim.currentZoom.rescaleY(app.scale.y);

            // rescale positions and dots
            d3.select("svg.view g")
              //  .attr("transform", dim.currentZoom)
                .selectAll("circle.dot")
                .attr("cx", d => xs(d.hdi))
                .attr("cy", d => ys(d.gdp));

            // rescale scales and axes
            app.axis.x.scale(xs);
            app.axis.y.scale(ys);
            d3.select(".x-axis").call(app.axis.x);
            d3.select(".y-axis").call(app.axis.y);
        })
        .on('end', function(evt) {
            if(evt.transform.k <= 1 + 1e-6) {
                d3.select("#zoom-reset").style("opacity", 0);
            } else {
                d3.select("#zoom-reset").style("opacity", 1);
            }
        });

    d3.select(".view").call(app.zoom);
}