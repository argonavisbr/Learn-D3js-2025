import * as d3 from "https://cdn.skypack.dev/d3@7";

export {makeGrid, drawSquares, drawSquare, svg, dim};

const dim = {width: 800, height: 800};
dim.h = dim.height;
dim.w = dim.width;

const svg = d3.select("body").append("svg")
                             .attr("width", dim.w)
                             .attr("height", dim.h);

const colors = [['#e41a1c','#377eb8','#4daf4a'],
                ['#984ea3','#ff7f00','#ffff33'],
                ['#a65628','#f781bf','#999999']];
const data = colors.map((p,i) => p.map((q,j) => ({color: q, x: i, y: j}) ))
                   .flat();
const side = 96; // side of the square
const scale = d3.scaleLinear().range([2,dim.w]).domain([1,9]);

function makeGrid() {
    const exes = d3.range(0,dim.w+1,50)
        .map(d => [[d,0],[d,dim.h]]);
    const wyes = d3.range(0,dim.h+1,50)
        .map(d => [[0,d],[dim.w,d]]);

    const line = d3.line();

    svg.selectAll(".grid")
        .data(d3.merge([exes, wyes]))
        .join("path").attr("class","grid")
        .attr("d", line)
        .style("stroke-width", d => d[0][0] === dim.w/2 || d[1][1] === dim.h/2 ? 3 : 1);
}

function drawSquares() {
    svg.selectAll("rect.square")
        .data(data)
        .join("rect").attr("class","square")
        .attr("x", d => 200 + scale(d.x))
        .attr("y", d => 200 + scale(d.y))
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