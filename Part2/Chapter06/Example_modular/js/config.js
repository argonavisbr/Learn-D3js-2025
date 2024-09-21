import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {app, dim} from "./constants.js";

// CONFIGURATION

export function configureView() {
    console.log(app.current)
    // 1) Get the current data object based on user selected id
    app.current.planet = app.planets.filter(p => p.id === app.current.id)[0];

    // 2) Change page title
    d3.select('#planetName').text(() => app.current.planet.name)

    // 3) Configure scales for this view
    // a) obtain the diameter of the largest moon
    const maxDiameter = d3.max(app.current.planet.satellites, d => d.diameterKm);

    // b) include only moons with 1/50 of the size of the largest moon or larger
    app.current.moons =app.current.planet.satellites
        .filter(s => s.diameterKm > maxDiameter/50);

    // c) add diameters (they will be drawn side by side)
    const sumDiameters = d3.sum(app.current.moons,d => d.diameterKm);

    // d) calculate space occupied by the circles
    const horizSpace = dim.width - (dim.margin.planet + dim.margin.left*2 + app.current.moons.length * dim.margin.moon);
    const vertSpace  = dim.height - dim.margin.top*2;

    // e) configure the scale
    app.scale.range([0, d3.min([vertSpace, horizSpace])])
        .domain([0, sumDiameters]);

    // 4) Sort the moons by their diameter
    app.current.moons.sort((a,b) => d3.descending(a.diameterKm, b.diameterKm));

    // 5) Compute cx center coordinates to position each moon
    app.current.moons.forEach(function(moon, i) {
        let space = 0;
        if(i > 0) {
            let previous = app.current.moons[i-1]
            space = previous.cx
                + app.scale(previous.diameterKm)/2
                + dim.margin.moon;
        }
        moon.cx = space + app.scale(moon.diameterKm)/2;
        console.log(moon.name, moon.cx); // inspect results
    });

    // 6) Disable button for currently displayed planet
    d3.selectAll("button").property("disabled", false);
    d3.select("button#"+app.current.id).property("disabled", true);

    // 7) Set the current color for the planet
    app.current.color  = app.colors[(+app.current.id.substring(1) - 3)];

}