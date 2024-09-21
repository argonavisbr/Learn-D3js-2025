import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {app, dim} from "./constants.js";

// RENDERING

export function draw(plane) {
    // 1) Draw a guide line showing the orbital plane
    // plane.append("line").attr("x1",0).attr("x2",dim.width) .style("stroke","red");

    // 2) draw the planet
    plane.select(".planet")
        .datum(app.current.planet)
        .attr("r", d => app.scale(d.diameterKm)/2)
        .attr("cx", d => -(dim.margin.left + app.scale(d.diameterKm)/2))
        .style("fill", d => app.current.color);

    // 3) draw the moons using .each()
    plane.selectAll("g.moon")
        .data(app.current.moons)
        .join(enter => enter.append("g")
            .attr("class", "moon")
            .each(function() {
                const moon = d3.select(this);
                moon.append("circle");
                moon.append("text");
            }))
        .attr("transform", d => `translate(${[d.cx,0]})`)
        .each(function() {
            const moon = d3.select(this);
            moon.select("circle")
                .attr("r", d => app.scale(d.diameterKm)/2);
            moon.select("text")
                .text(d => d.name)
                .attr("transform", d => {
                    const x = app.scale(d.diameterKm/2) + dim.margin.moon;
                    const y = 5;
                    return `rotate(-90) translate(${[x,y]})`;
                });
        });
}