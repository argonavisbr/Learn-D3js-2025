import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function log(evt) {
    console.log("Handler", this);      // which element handled event
    console.log("Target", evt.target)  // which element caught event
    console.log("MouseEvent", [evt.clientX, evt.clientY])
    console.log("Event", [evt.x, evt.y])

    console.log("d3.pointer of this", d3.pointer(evt, this))
    console.log("d3.pointer of blue rect", d3.pointer(evt, d3.select(".blue").node()))
    console.log("d3.pointer of red rect", d3.pointer(evt, d3.select(".red").node()))
    console.log("d3.pointer of svg", d3.pointer(evt, d3.select("svg").node()))
    console.log("d3.pointer of root", d3.pointer(evt, document.documentElement))
}

function getCoords(evt) {
    console.log('this', this)
    const svgn = d3.select("svg").node();
    const svgx = +svgn.style.left.replace("px","");
    const svgy = +svgn.style.top.replace("px","");
    return {
        svg: d3.pointer(evt, svgn),
        g: d3.pointer(evt, d3.select("g").node()),
        this: d3.pointer(evt, this),
        page: [svgx, svgy] // copied from CSS
    }
}

export function clicked(evt) {
    evt.stopPropagation();
    log.call(this, evt); // use .call to preserve "this"

    const coords = getCoords.call(this, evt); // use .call to preserve "this"
    console.log(coords)
    const svg = d3.select("svg");

    // Any one of these will place the circle under the click
    showPoint(svg, [evt.x - coords.page[0], evt.y - coords.page[1]]);
    //showPoint(svg, coords.svg);
    //showPoint(g, coords.g);
    //showPoint(g, coords.this);
}

function showPoint(obj, coords) {
    console.log('SVG coords to use: ', coords);
    d3.selectAll("circle").remove();
    d3.select("svg")
        .append("circle")
          .attr("r", 5)
          .attr("cx", coords[0])
          .attr("cy", coords[1])
}