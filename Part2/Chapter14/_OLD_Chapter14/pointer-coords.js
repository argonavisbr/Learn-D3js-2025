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
    const svgx = svgn.style.left.replace("px","");
    const svgy = svgn.style.top.replace("px","");
    return {
        svg: d3.pointer(evt, svgn),
        g: d3.pointer(evt, d3.select("g").node()),
        this: d3.pointer(evt, this),
        page: [svgx, svgy] // copied from CSS
    }
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


const fmt = d3.format(",d");

export function clickedInfo(evt) {
    evt.stopPropagation();
    log.call(this, evt);
    const coords = getCoords.call(this, evt); // use call to preserve 'this'

    const svg = d3.select("svg");
    const g = svg.select("g")

    // local coordinates in group context
    showPointInfo.call(this, evt, coords.g, g, "this", "CORRECT: g coords in <g> context, svg coords in <svg> context:", true)

    // You can use "this" but if clicked in <rect>, since <rect> is not a container, you won't be able to add content
    //showPointInfo.call(this, evt, coords.this, d3.select(this), "this", "CORRECT: g coords in <g> context, svg coords in <svg> context:", true)

    // root coordinates used in svg context
    showPointInfo.call(this, evt, [evt.x, evt.y], svg, "svg", "WRONG: using event coords in <svg> context")

    // root coordinates used in group context
    showPointInfo.call(this, evt, [evt.x, evt.y], g, "g", "WRONG: using event coords in <g> context")
}

function showPointInfo(evt, point, obj, cls, msg, details = false) {
    d3.selectAll(`.${cls}`).remove();
    obj.append("g").attr("class", cls)
        .attr("transform", `translate(${point})`)
        .each(function() {
            const pt = d3.select(this);
            pt.append("circle")
                .attr("r", 5);
            pt.append("text")
                .attr("x", 12)
                .attr("y",4)
                .text(msg)
            if(details) {
                const coords = getCoords(evt)
                const cs = coords["svg"].map(d => fmt(d));
                const cg = coords["g"].map(d => fmt(d));
                const ct = coords['this'].map(d => fmt(d));

                pt.append("text").attr("x", 12).attr("y", 19)
                    .text(`client context = window: (${[evt.x,evt.y]})`)
                pt.append("text").attr("x", 12).attr("y", 34)
                    .text(`this context = window: (${ct})`)
                pt.append("text").attr("x", 12).attr("y", 49)
                    .text(`<svg> context: (${cs})`)
                pt.append("text").attr("x", 12).attr("y", 64)
                    .text(`<g> context: (${cg})`)

            }
        })
}