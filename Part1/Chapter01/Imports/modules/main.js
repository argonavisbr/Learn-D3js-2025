// importing D3 modules
import "https://cdn.skypack.dev/d3-transition@3";
import * as d3 from "https://cdn.skypack.dev/d3-selection@3";

const array = [100, 200, 300, 350, 375, 400, 500];
const newArray = [225, 425, 125, 50, 450, 75, 325];

d3.select("#chart")
    .selectAll("circle")
    .data(array).join("circle")
    .attr("r", "10").attr("cy", 100).attr("cx", d => d);

function update(dataset) {
    d3.select("#chart").selectAll("circle")
      .data(dataset)
        .transition().duration(1000)
         .attr("r", 5)
         .attr("cx", d => d)
         .style("fill", "red")
}

export function start() {
    setTimeout(update, 2000, newArray);
}
