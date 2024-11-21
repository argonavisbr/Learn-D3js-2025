import * as d3 from "https://cdn.skypack.dev/d3@7";

import * as view from "./view-1.6.js";
import {chart, getTransition} from "./common-1.4.js";

function animate(index) {
    d3.select("svg.chart")
      .transition(getTransition())
        .on("interrupt", () => { // interrupts the transition (pausing the animation)
            chart.state = index; // saves the current frame number, to be used when resuming the animation
        })
        .end().then(() => {
            view.show(chart.data[index]);
            if(index < chart.data.length-1) {
                animate(++index);
            }
        })
        .catch((e) => {
            if (e) { // if other errors occur, log them and quit
                console.log(e);
                throw e;
            }
            else { // if the transition is interrupted, it will pause the animation
                console.log("Animation paused at frame " + index + ".");
                chart.paused = true;
            }
        });
}

export function start() {
    animate(0);
}

export function pause() {
    if(chart.paused) {  // if chart is paused, then resume
        d3.select("#pause").text("pause");
        chart.paused = false;
        animate(chart.state); // continue animation from frame that was interrupted
        console.log("Animation resumed from frame " + chart.state + ".");
    } else {
        d3.select("#pause").text("resume");
        d3.select("svg.chart").interrupt(); // interrupt the main transition (chart state is saved in event handler)
    }
}