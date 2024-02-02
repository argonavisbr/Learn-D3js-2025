function renderSchemeOrdinal(obj, index) {

    const arr = d3[obj.scheme][obj.size];
    const name = `d3.${obj.scheme}[${obj.size}]`;

    const scale = d3.scaleOrdinal(arr);
    const data = d3.range(0, obj.size);

    const dim = {h: 15, w: 20, marg: 180, xx: 25}; // parameters for display

    const g = d3.select("svg")
                .append("g")
                  .attr("transform", `translate(25,${index * 50})`);

    g.selectAll("rect")
      .data(data)
        .join("rect")
          .attr("height", dim.h)
          .attr("width", dim.w)
          .attr("y", 25)
          .attr("x", d => d * dim.xx)
          .style("fill", scale);

    g.append("text")
        .attr("y", 14)
        .text(name);
}
