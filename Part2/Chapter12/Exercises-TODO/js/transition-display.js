function monitorTransition(t) {
    let start = d3.now();
    const duration = t.duration();
    const delay = t.delay();
    const timer = d3.interval(function() {
        const elapsed = d3.now() - start;
        if(elapsed < delay) {
            updateProgress("delay", elapsed, delay, elapsed/1000, true);
        }
    }, 10);
    t.on("start", () => {timer.stop(); start = d3.now()}) // called when the transition starts
        .tween("", () => t => {
            const elapsed = d3.now() - start;
            updateProgress("steps", t, 1);
            updateProgress("duration", elapsed, duration, elapsed/1000);
        })
}

function createTransitionPanel(container, x = 0, y = 0, width = 800) {
    const panel = container.append("g").attr("transform", `translate(${x}, ${y})`);

    createProgressBar(panel, "delay", 20, width - 200, "Delay", 80, "limegreen", 100, 1)
        .attr("transform", "translate(10, 0)");
    createProgressBar(panel, "steps", 20, width - 200, "Steps", 80, "crimson", 0, 1)
        .attr("transform", "translate(10, 40)");
    createProgressBar(panel, "duration", 20, width - 200, "Duration", 80, "royalblue", 0, 1)
        .attr("transform", "translate(10, 80)");

}

function updateProgress(id, partial, total, displayVal = partial, invert = false) {
    const max = invert ? 1 - partial/total : partial/total;
    d3.select(`#${id}-value`).text(`${d3.format(".2f")(displayVal)}`);
    d3.selectAll(`#${id} rect.dynamic`)
        .attr("opacity", (d,i) => i <= (max*100)-1 ? 1 : 0);
}

function createProgressBar(container, id, height, width, label, start, color, percent, maxVal) {
    const bar = container.append("g").attr("id", id);

    bar.append("text")
        .attr("class", "label")
        .attr("x", start - 5)
        .attr("y", height/2)
        .style("text-anchor", "end")
        .style("alignment-baseline", "middle")
        .text(label);

    const cellWidth = width / 100;

    addBar(bar, id, height, cellWidth, start, "lightBlue", true);
    addBar(bar, id, height, cellWidth, start, color, false, percent);

    bar.append("text")
        .attr("class", "value")
        .attr("id", `${id}-value`)
        .attr("x", start + cellWidth * 100 + 5)
        .attr("y", height/2)
        .style("text-anchor", "start")
        .style("alignment-baseline", "middle")
        .text(d3.format(".2f")(maxVal * percent / 100))

    return bar;
}

function addBar(container, id, height, cellWidth, start, color, staticBar, percent = 0) {
    container.selectAll(`rect.cell.${staticBar ? "static" : "dynamic"}`)
        .data(d3.range(0, 100))
        .join("rect")
        .attr("class", `cell ${staticBar ? "static" : "dynamic"}`)
        .attr("x", (d, i) => start + cellWidth * i)
        .attr("y", 0)
        .attr("width", cellWidth)
        .attr("height", height)
        .style("stroke", "white")
        .style("fill", color)
        .attr("opacity", (d,i) => staticBar ? 1 : i < percent ? 1 : 0);
}