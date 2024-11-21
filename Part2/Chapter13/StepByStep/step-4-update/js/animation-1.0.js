import * as d3 from "https://cdn.skypack.dev/d3@7";

import * as view from "./view-1.2.js";
import {chart} from "./common-1.1.js";

let index = 0;

export function controls() {
    const controls =
        d3.select("body")
          .append("div")
          .attr("class", "controls").style("clear", "both");

    controls.append("button").attr("id", "back").text("Previous")
            .property("disabled", true)
            .on("click", handleClick);
    controls.append("button").attr("id", "forward").text("Next")
            .on("click", handleClick);
}

function handleClick(e) {
    index += e.target.id === "forward" ? 1 : -1;
    view.show(chart.data[index]);
    d3.select("#back").property("disabled", index === 0);
    d3.select("#forward").property("disabled", index === chart.data.length - 1);
}