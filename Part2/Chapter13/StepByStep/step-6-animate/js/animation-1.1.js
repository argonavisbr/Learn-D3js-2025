import * as d3 from "https://cdn.skypack.dev/d3@7";

import * as view from "./view-1.3.js";
import {chart, getTransition} from "./common-1.2.js";

function animate(index) {
    d3.select("svg.chart")
      .transition(getTransition())
        .end().then(() => {
            view.show(chart.data[index]);
            if(index < chart.data.length-1) {
                animate(++index);
            }
        });
}

export function start() {
    view.show(chart.data[0]);
    animate(1);
}