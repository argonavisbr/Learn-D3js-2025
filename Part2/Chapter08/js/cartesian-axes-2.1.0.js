/**
 * Cartesian system generator. To be used with cartesian-axes-2.1.0.css
 * @version 2.1.0 2024-04-09
 *
 */

const dvj = {};

/**
 * Creates a cartesian axes generator function.
 * @returns A function that when called will generate a system of cartesian axes
 */
dvj.cartesianAxes = function() {
    let context = null;
    let xScale = null;
    let yScale = null;
    let xLabel = 'x values';
    let yLabel = 'y values';
    let showHorizontalGrid = false;
    let showVerticalGrid = false;

    function f() {
        dvj.drawCartesianAxes(context, xScale, yScale, xLabel, yLabel, showHorizontalGrid, showVerticalGrid);
    }

    f.context = arg => (arguments.length) ? context : (context = arg, f);
    f.xScale = arg => (arguments.length) ? xScale : (xScale = arg, f);
    f.yScale = arg => (arguments.length) ? yScale : (yScale = arg, f);
    f.xLabel = arg => (arguments.length) ? xLabel : (xLabel = arg, f);
    f.yLabel = arg => (arguments.length) ? yLabel : (yLabel = arg, f);
    f.showHorizontalGrid = arg => (arguments.length) ? showHorizontalGrid : (showHorizontalGrid = arg, f);
    f.showVerticalGrid = arg => (arguments.length) ? showVerticalGrid : (showVerticalGrid = arg, f);

    return f;
}

/**
 * @param svg The SVG context where to draw the axes (top-left corner at the origin)
 * @param xScale  The scale for the x-axis
 * @param yScale  The scale for the y-axis
 * @param xLabel  The label for the x-axis, default = 'x values'
 * @param yLabel  The label for the y-axis, default = 'y values'
 * @param showHorizontalGrid  Whether to show horizontal grid lines, default = false
 * @param showVerticalGrid  Whether to show vertical grid lines, default = false
 *
 */
dvj.drawCartesianAxes = function(svg, xScale, yScale, xLabel = 'x values', yLabel = 'y values',
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



