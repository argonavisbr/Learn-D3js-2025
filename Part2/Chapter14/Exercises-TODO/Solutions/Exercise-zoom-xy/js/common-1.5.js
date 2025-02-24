import * as d3 from 'https://cdn.skypack.dev/d3@7';

export {dim, app};

const dim = {
    w: 500, h: 300,
    margin: {h: 40, w: 50},
    legend: {w: 20, h: 10},
    radius: 2,
    currentZoom: d3.zoomIdentity
};

const zextent = [[0, 0], [dim.w - dim.margin.w*2, dim.h - dim.margin.h*2]];

const app = {
    data: {},
    color: d3.scaleOrdinal(d3.schemeDark2),
    scale: {
        x: d3.scaleLinear()
            .range([0, dim.w - dim.margin.w*2]),
        y: d3.scaleLog()
            .range([dim.h - dim.margin.h*2, 0]),
    },
    format: {
        gdp: d3.format(",.3s")
    },
    zoom: d3.zoom()
            .extent(zextent)
            .translateExtent(zextent)
            .scaleExtent([1, 3])
}

app.axis = {
    x: d3.axisBottom(app.scale.x)
        .tickSize(dim.h - dim.margin.h * 2 + 10)
        .tickPadding(2),
    y: d3.axisLeft(app.scale.y)
        .tickSize(dim.w - dim.margin.h * 2 + 10)
        .tickPadding(2)
        .ticks(8, ',')
}