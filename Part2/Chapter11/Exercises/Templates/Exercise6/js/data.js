import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {app, data} from "./common.js";

export async function load(file) {
    const csv = await d3.csv(file, d3.autoType)
    console.log('csv', csv);

    // Load, parse and prepare data
    const text = await d3.text(file)
    // Each array in set contains city and average temperature for each month [[city, t1, t2, ..., t12], ...]
    const rawData = d3.csvParseRows(text, d3.autoType);

    const valueRows = rawData.filter((d,i) => i > 0) // all except first row
    data.months = rawData.filter((d,i) => i === 0)  // get first row
                         .map(d => d.slice(1))[0]   // just the month names

    // Each array in set contains city and array of temperature in ºC [[city, [t1, t2, ..., t12]], ... ]
    data.city = valueRows.map(d => [d[0], d.slice(1)]);
    data.city.sort((a,b) => d3.ascending(a[0], b[0]));
    config();
}

function config() {
    // Configure the scale domains (scale.x is a point scale, scale.y is a linear scale)
    app.scale.x.domain(data.months);
    app.scale.y.domain([d3.min(data.city.map(d => d[1]).flat()) - 5,
                        d3.max(data.city.map(d => d[1]).flat()) + 5]);

    app.color = d3.scaleOrdinal(d3.schemeCategory10);

    // EXERCISE
    // a) Set up the line function in app.line (use a curve)
    // ADD YOUR CODE HERE
}