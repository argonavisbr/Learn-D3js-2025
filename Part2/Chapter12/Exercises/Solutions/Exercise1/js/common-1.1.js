import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export {dim, app, data};

// EXERCISE: 1) adjust the view height to fit the half-pie chart (remove 300px from the height)
const dim = {width: 800, height: 500, margin: 100};
const data = {};
const app = {
    limit: 10,
    pie: d3.pie()
        .value(d => d.gdp)
        .sortValues(d3.descending)
        .startAngle(-Math.PI/2)   // EXERCISE: 2) Change to start at -90 degrees (left of the circle)
        .endAngle(Math.PI/2),     // EXERCISE: 3) Change to end at +90 degrees (right of the circle)
    arc: d3.arc()
        .innerRadius(50)
        .outerRadius(dim.width/2 - dim.margin)
        .padAngle(.5)
        .padRadius(10)
}

// A simple color scale, for 10 or 20 different coutries + 1 - last color is gray (rest of the world)
app.color= d3.scaleOrdinal(app.limit <= 10 ?
                           d3.schemeTableau10.concat("#777") :
                           d3.schemeTableau10.concat(d3.schemeObservable10).concat("#777"));