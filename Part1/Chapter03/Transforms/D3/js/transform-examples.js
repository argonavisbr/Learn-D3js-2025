import * as d3 from "https://cdn.skypack.dev/d3-selection@3";

export function showMatrix(section, svg) {
    d3.selectAll(section)
        .each(function (d,i) {
            const mx = this.getCTM();
            const sm = svg.node().getCTM();
            const transform = `matrix(${[mx.a-sm.a, mx.b-sm.b, mx.c-sm.c, mx.d-sm.d, mx.e-sm.e, mx.f-sm.f]})`;
            console.log(`matrix-${i}`, transform);
            d3.select(`#matrix-${i}`).text(transform);
        });
}

export function setup(data, width=600, height=400) {
    const div = d3.select("body")
        .selectAll("div")
        .data(data)
        .join("div")
        .attr("class", "view")
        .attr("width", width);
    div.append("p")
        .html((d, i) => `<b><code>${d}</code></b> ___ or ___ <b><code id="matrix-${i}"></code></b>`);

    const svg = div.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `-${width/2} -${height/2} ${width} ${height}`);

    addMarker(svg);
    return svg;
}

export function addMarker(container) {
    container.append("defs").append("marker").attr("id", "arrow")
        .attr("markerWidth", 10).attr("markerHeight", 6)
        .attr("refY", 3).attr("refX", 8)
        .attr("orient", "auto-start-reverse")
        .attr("markerUnits", "strokeWidth")
        .append("path")
        .attr("d", "M0,0 L0,6 L9,3 z");
}

export function addAxes(container, color = "black") {
    container.append("line")
        .attr("x1", -300).attr("y1", 0).attr("x2", 300).attr("y2", 0)
        .style("stroke", color)
        .style("stroke-width", 2)
        .attr("marker-end", "url(#arrow)")
        .attr("marker-start", "url(#arrow)");

    container.append("line").attr("y1", -200).attr("y2", 200)
        .style("stroke", color)
        .style("stroke-width", 2)
        .attr("marker-end", "url(#arrow)")
        .attr("marker-start", "url(#arrow)");
}

export function addCircle(group) {
    group.append("circle").attr("cx", 25).attr("cy", 25).attr("r", 50);
}

export function addPolygonAndText(group, showCenter = false) {
    group.append("polygon").attr("points", "0,0 100,5 75,25 100,45 0,50");
    group.append("text").attr("x", 10).attr("y", 28).text("SVG");

    if(showCenter) {
        group.append("circle").attr("class", "center")
             .attr("cx", 50).attr("cy", 25).attr("r", 3)
             .style("fill", "red").style("stroke", "black").style("opacity", 1);
    }
}