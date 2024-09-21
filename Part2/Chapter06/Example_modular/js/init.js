import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {app, dim} from "./constants.js";
import {configureView} from "./config.js";
import {draw} from "./render.js";

// INITIALIZATION
export function init(plane) {
    // 1) Configure the form
    d3.select("form")
        .selectAll("button")
        .data(app.planets)
        .join("button")
        .attr("type", "button") // disables default submission event
        .attr("id", d => d.id)
        .text(d => d.name)
        .on("click", function(event, d) { // change from v5 to v7!!
            app.current.id = d.id;
            configureView();
            draw(plane);
        });
    // 2) Add circle for the planets
    plane.append("circle")
        .attr("class", "planet");
}