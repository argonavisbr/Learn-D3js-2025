/**
 * To be used with cartesian-axes-2.1.0.css
 * @param svg The SVG context where to draw the axes (top-left corner at the origin)
 * @param xScale  The scale for the x-axis
 * @param yScale  The scale for the y-axis
 *
 * @version 1.1.5 2024-04-03
 */
function drawCartesianAxes(svg, xScale, yScale, xLabel = 'x values', yLabel = 'y values',
                           showHorizontalGrid = false, showVerticalGrid = false) {

    const top = yScale.range()[0];
    const left = xScale.range()[0];
    const bottom = yScale.range()[1];
    const right = xScale.range()[1];

    const labelPadding = -40;
    const tickBleed = 5;

    const axisX = d3.axisBottom(xScale)
                    .tickPadding(tickBleed);
    const axisY = d3.axisLeft(yScale)
                    .tickPadding(tickBleed);

    if (showHorizontalGrid) {
        axisY.tickSize(left - right)
             .tickSizeOuter(0);
    }
    if (showVerticalGrid) {
        axisX.tickSize(bottom - top)
             .tickSizeOuter(0);
    }

    const xG = svg.append("g")
                 .attr("class", "x-axis")
                 .attr("transform", `translate(0,${top})`)
                 .call(axisX);

    const yG = svg.append("g")
                 .attr("class", "y-axis")
                 .attr("transform", `translate(${left},0)`)
                 .call(axisY);

    xG.append("text")
        .attr("class","label")
        .text(xLabel)
        .attr("transform", `translate(${[(right + left)/2, -labelPadding]})`)
    yG.append("text")
        .attr("class","label")
        .text(yLabel)
        .attr("transform", `translate(${[labelPadding, (top + bottom)/2]}) rotate(90)`)
}



