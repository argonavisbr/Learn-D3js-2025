import * as d3 from "https://cdn.skypack.dev/d3@7";

export {makeGrid, drawSquares, drawSquare, renderCanvas, updateCanvas, gridData, svg, dim, canvas, ctx, chart};

const dim = {width: 800, height: 800};
dim.h = dim.height;
dim.w = dim.width;

const svg = d3.create("svg")
              .attr("width", dim.width)
              .attr("height", dim.height);

const chart = svg.append("g")
                 .attr("class", "chart");

const canvas = d3.create("canvas")
                 .attr("height", dim.height)
                 .attr("width", dim.width);

const ctx = canvas.node().getContext("2d");

const grid = {exes: null, wyes: null};

const colors = [['#e41a1c','#377eb8','#4daf4a'],
                ['#984ea3','#ff7f00','#ffff33'],
                ['#a65628','#f781bf','#999999']];
const data = colors.map((p,i) => p.map((q,j) => ({color: q, row: i, col: j}) )).flat();
const side = 96; // side of the square

function gridData(margin = 0, width = dim.width, height = dim.height) {
    chart.width = width - margin * 2;
    chart.height = height - margin * 2;

    grid.exes = d3.range(0, chart.width + 1, 50)
                  .map(d => [[d, 0], [d, chart.height]]);
    grid.wyes = d3.range(0, chart.height + 1, 50)
                  .map(d => [[0, d], [chart.width, d]]);

    return [grid.exes, grid.wyes].flat();
}

function makeGrid(margin = 0, width = dim.width, height = dim.height) {

    d3.select("body").append(() => svg.node());

    svg.attr("width", width).attr("height", height);
    chart.attr("transform", `translate(${[margin,margin]})`);

    return chart.selectAll(".grid")
                .data(gridData(margin, width, height))
                .join("path").attr("class","grid")
                .attr("d", d3.line())
                .style("stroke-width", d => d[0][0] === chart.width/2 || d[1][1] === chart.height/2 ? 3 : 1);
}

function renderCanvas(margin = 0, width = dim.width, height = dim.height) {
    d3.select("body").append(() => canvas.node());
    ctx.translate(margin, margin);
    updateCanvas(gridData(margin, width, height));
}

function updateCanvas(data) {
    ctx.fillStyle = "red";
    ctx.fillRect(300,200,100,100);
    ctx.fillStyle = "transparent";
    ctx.strokeStyle = "gray";
    ctx.lineWidth = d => d[0][0] === chart.width/2 || d[1][1] === chart.width/2 ? 3 : 1;

    data.forEach(function(d) {
        ctx.beginPath();
        d3.line().context(ctx)(d);
        ctx.stroke();
    });
    ctx.strokeStyle = "transparent";
}

function drawSquares() {
    chart.selectAll("rect.square")
         .data(data)
           .join("rect").attr("class","square")
             .datum((d,i,nodes) => ({...d, i, nodes})) // inserting index and nodes into datum
                .attr("x", d => 2 + 100 * (d.row + 1))
                .attr("y", d => 2 + 100 * (d.col + 1))
                .attr("width", side)
                .attr("height", side)
                .style("fill", d => d.color);
}

function drawSquare(x,y,w,h,color) {
    return chart.append("rect").attr("class","square")
                 .attr("x",x).attr("y",y)
                 .attr("width", w).attr("height", h)
                 .attr("fill", color);
}