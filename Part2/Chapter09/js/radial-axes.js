/**
 * Creates a radial grid. To be used with radial-axes-2.1.0.css
 *
 * @param svg The SVG context where to draw the axes (will be placed at the origin)
 * @param aScale The scale used for the angular data
 * @param rScale The scale used for the radial data, which also determines the size of the system
 * @param angularData The array of data labels for the axes, default = [0,1,2,3,4,5,6,7,8,9,10,11]
 * @param numTicks The number of ticks per axis, default = 6
 * @param useGrid Whether to draw a grid or not, default = false
 * @param backdropOpacity The opacity of the backdrop behind the text, default = 1
 *
 * @version 1.2.2 2024-04-05
 */
function drawRadialAxes(svg, aScale, rScale,
                        angularData = d3.range(0,12),
                        numTicks = 6,
                        useGrid = false,
                        backdropOpacity = 1) {

    const axis = d3.axisBottom(rScale)
        .ticks(numTicks)
        .tickSize(0)
        .tickPadding(0)
        .tickSizeOuter(0);

    // Rotate 90 degrees counterclockwise so that ticks appear vertically
    const g = svg.append("g")
                 .attr("class", "chart")
                 .attr("transform","rotate(-90)");

    // Draw concentric circles if useGrid is true
    if(useGrid) {
        g.selectAll("circle.grid")
           .data(axis.scale().ticks(numTicks))
             .join("circle")
               .attr("class", d => d === 0 ? "grid zero" : "grid") // different style for zero line
               .attr("r", rScale);
    }

    // This will render an axis every 360/angularData.length degrees
    // Only the first axis will have text labels (the rest will be blank)
    g.selectAll("g.axis")
      .data(angularData)
        .join("g")
          .attr("class", "axis")
          .classed("blank",(d,i) => i !== 0) // blank labels in all except first (via CSS)
          .call(axis)
          .attr("transform", (d,i) => (console.log(d) || `rotate(${(i * 360/angularData.length)})`));

    // Don't show tick lines for blank axes if useGrid is true
    if(useGrid) {
        g.selectAll(".blank line").style("display","none");
    }

    // Centers tick lines in relation to domain line
    g.selectAll(".tick line")
        .attr("y1", -3)
        .attr("y2", 4);

    // Backdrop applied to first axis (a white 24x16 rectangle behind the text)
    const rh = 16, rw = 24; // note that they are inverted
    g.select(".axis") // selects only first axis
      .selectAll(".tick")
         .insert("rect", ".tick text")
            .attr("x", -rh/2)
            .attr("y", -rw/2)
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", rh)
            .attr("height", rw)
            .style("opacity", backdropOpacity);

    // Centers tick text in relation to domain line
    g.selectAll(".tick text")
        .attr("y", -4)
        .attr("transform", "rotate(90)");

    // Labels for each axis
    g.selectAll("text.angle.label")
       .data(angularData)
         .join("text")
            .attr("class", "angle label")
            .text(d => d)
            .attr("x", (d,i) => polarToCartesian(aScale(i), rScale.range()[1] + 15)[0])
            .attr("y", (d,i) => polarToCartesian(aScale(i), rScale.range()[1] + 15)[1])
            .attr("transform", "rotate(90)");
}

/**
 * Converts polar coordinates to cartesian coordinates
 * @param angle The angle in radians
 * @param radius The radius
 * @returns {number[]} The cartesian coordinates [x,y]
 */
function polarToCartesian(angle, radius) {
    return [radius * (Math.cos(angle - Math.PI/2)), radius * (Math.sin(angle - Math.PI/2))];
}

/**
 * Converts cartesian coordinates to polar coordinates
 * @param x The x coordinate
 * @param y The y coordinate
 * @returns {number[]} The polar coordinates [angle, radius]
 */
function cartesianToPolar(x, y) {
    return [Math.atan2(y, x) + Math.PI / 2, Math.sqrt(x * x + y * y)];
}



