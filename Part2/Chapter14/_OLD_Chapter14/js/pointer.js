import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function log(evt) {
    console.clear();
    console.log("Handler (this)", this);      // which element handled event
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
    const svgn = d3.select("svg").node();
    const svgx = +svgn.style.left.replace("px","");
    const svgy = +svgn.style.top.replace("px","");
    const {x,y} = pointerCTM(evt, svgn)
    return {
        svg: d3.pointer(evt, svgn),
        g: d3.pointer(evt, d3.select("g").node()),
        this: d3.pointer(evt, this),
        page: [svgx, svgy], // copied from CSS
        ctm: [x,y]
    }
}

// Equivalent implementation of d3.pointer() using the CTM
function pointerCTM(evt, obj) {
    const pt = obj.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(obj.getScreenCTM().inverse());
}

export function clicked(evt) {
    evt.stopPropagation();
    log.call(this, evt); // use .call to preserve "this"

    const coords = getCoords.call(this, evt); // use .call to preserve "this"
    console.log("Coordinates: ", coords)
    const svg = d3.select("svg");
    const g = d3.select("g")

    // Any one of these will place the circle under the click
    showPoint(svg, coords.svg);
    //showPoint(svg, coords.ctm);
    //showPoint(g, coords.g);

    // This will place the circle under the click if the click is in the <g> area
    // showPoint(g, coords.this);

    // This will place the circle under the click if the click is in the <svg> area (but not in <g>)
    // showPoint(svg, coords.this);
}

function showPoint(obj, coords) {
    console.log('<' + obj.node().nodeName +'> coords to use: ', coords);
    d3.selectAll("circle").remove();
    obj.append("circle")
          .attr("r", 5)
          .attr("cx", coords[0])
          .attr("cy", coords[1])
}