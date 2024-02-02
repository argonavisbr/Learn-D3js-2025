
function plot(chart, scale, thresholds) {
    showIntervals(chart, scale, thresholds);
    drawAxis(chart);
    plotData(chart, scale);
}

function drawAxis(chart) {
    chart.append("g")
        .attr("transform","translate(0,25)")
        .call(axis);
}

function showIntervals(chart, scale, thresholds) {
    chart.append("g")
        .selectAll("rect")
        .data(thresholds)
        .join("rect")
        .attr("width", d => scaleAxis(d[1] - d[0]))
        .attr("x", d => scaleAxis(d[0]))
        .attr("y", 0)
        .attr("height", 50)
        .style("fill", d => scale(d[0]));
}

function plotData(chart, scale) {
    chart.append("g")
        .selectAll("circle")
        .data(data).join("circle")
        .attr("r", 4)
        .attr("cx", d => scaleAxis(d))
        .attr("cy", 25)
        .style("fill", d => scale(d));
}