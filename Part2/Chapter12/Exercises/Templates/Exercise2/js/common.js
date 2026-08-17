import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export {dim, app, data};

const dim = {height: 750, width: 850};

const data = {};
const app = {
    limit: 10,
    pie: d3.pie(), // EXERCISE: configure the pie function
    arc: d3.arc()
            .innerRadius(4)
            .outerRadius(280)
            .padAngle(.2)
            .padRadius(8),
    fmt: d3.format(",.3s"),
    color: d3.scaleOrdinal(d3.schemeTableau10)
}