import * as d3 from "https://cdn.skypack.dev/d3@7";

export {makeGrid, drawSquares, drawSquare, svg, dim};

const dim = {width: 800, height: 800};
dim.h = dim.height;
dim.w = dim.width;

const svg = d3.select("body").append("svg")
                             .attr("width", dim.width)
                             .attr("height", dim.height);

const colors = [['#e41a1c','#377eb8','#4daf4a'],
                ['#984ea3','#ff7f00','#ffff33'],
                ['#a65628','#f781bf','#999999']];
const data = colors.map((p,i) => p.map((q,j) => ({color: q, row: i, col: j}) )).flat();
const side = 96; // side of the square

function makeGrid() {
    const exes = d3.range(0,dim.width+1,50)
        .map(d => [[d,0],[d,dim.height]]);
    const wyes = d3.range(0,dim.height+1,50)
        .map(d => [[0,d],[dim.width,d]]);

    const line = d3.line();

    svg.selectAll(".grid")
        .data(d3.merge([exes, wyes]))
        .join("path").attr("class","grid")
        .attr("d", line)
        .style("stroke-width", d => d[0][0] === dim.width/2 || d[1][1] === dim.height/2 ? 3 : 1);
}

function drawSquares() {
    svg.selectAll("rect.square")
        .data(data)
        .join("rect").attr("class","square")
        .datum((d,i,nodes) => ({...d, i, nodes})) // inserting index and nodes into datum
        .attr("x", d => 2 + 100 * (d.row + 1))
        .attr("y", d => 2 + 100 * (d.col + 1))
        .attr("width", side)
        .attr("height", side)
        .style("fill", d => d.color);
}

function drawSquare(x,y,w,h,color){
    svg.append("rect").attr("class","square")
        .attr("x",x).attr("y",y)
        .attr("width", w).attr("height", h)
        .attr("fill", color)
}