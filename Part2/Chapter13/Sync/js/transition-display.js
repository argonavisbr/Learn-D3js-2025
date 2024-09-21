/**
 * List of events that can be registered for a transition and colors for display
  */
const evts = [
    {name: "on.start", color: "green"},
    {name: "tween", color: "purple"},
    {name: "on.interrupt", color: "darkorange"},
    {name: "on.cancel", color: "red"},
    {name: "on.end", color: "darkslateblue"},
    {name: "end.resolve", color: "teal"},
    {name: "end.reject", color: "maroon"},
    {name: "", color: "none"}
];

const evtsMap = new Map();
evts.forEach(d => evtsMap.set(d.name, d));

const format = d3.format(".2f");

/**
 * Render chart
 */
function renderChart(container, spacing) {
    container.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${0})`)
        .call(axis);
    d3.select(".axis .domain")
        .attr("transform", `translate(0,${dim.height - 100})`);
    chartLines(spacing);
}

/**
 * Registers listeners for the transition events
 * @param data
 */
function registerListeners(data) {

    printLabels(data);

    data.transition.on("start", () => log(data.name, evtsMap.get("on.start"), data.position));
    data.transition.tween("", () => t => log(data.name, evtsMap.get("tween"), data.position + spacing));

    data.transition.on("interrupt", () => {
        log(data.name, evtsMap.get("on.interrupt"), data.position + spacing*2);
        data.interrupted = true;
    });

    data.transition.on("cancel", () => log(data.name, evtsMap.get("on.cancel"), data.position + spacing*3));
    data.transition.on("end", () => log(data.name, evtsMap.get("on.end"), data.position + spacing*4));

    data.transition.end()
        .then(() => { // Transition completed
            log(data.name, evtsMap.get("end.resolve"), data.position + spacing*5);
            d3.select("#"+data.name).style("fill", "green").style("stroke", "green");
        })
        .catch(() => { // Transition did not complete
            log(data.name, evtsMap.get("end.reject"), data.position + spacing*6);
            if(data.interrupted) {
                d3.select("#"+data.name).style("fill", "gold").style("stroke", "darkorange");
            } else {
                d3.select("#"+data.name).style("fill", "red").style("stroke", "red");
            }
        });
}

/**
 * Prints labels for the events on the right side of the screen
 * @param data  The transition data
 */
function printLabels(data) {

    const labels = evts.map(d => d.name);

    if(data.length > 1) {
        svg.append("text")
            .text(data.name.replace("-", "."))
            .attr("class", "label")
            .attr("x", 10)
            .attr("y", data.position + spacing * 3)
            .style("font-size", spacing)
            .style("fill", "black");
    }

    svg.selectAll(".label.event."+data.name)
        .data(evts.map(d => d.color))
        .join("text")
        .attr("class", "label event "+data.name)
        .attr("x", 60)
        .attr("y", (d,i) => data.position + spacing * i + spacing/15)
        .style("fill", d => d)
        .style("font-size", spacing * 2/3)
        .text((d,i) => labels[i])
}

function log(name, evt, pos) {

    const time = format(d3.now() - start);

    console.log(`${time}ms: ${name} ${evt.name}`);

    svg.append("rect")
        .attr("class", "bar")
        .attr("x", scale(parseInt(time)))
        .attr("y", pos)
        .attr("width", evt.name === "tween" || evt.name === "delay" ? 2 : 10)
        .attr("height", spacing * 2 / 3)
        .attr("fill", evt.color);
}

function chartLines() {
    const lines = d3.range(0, spacing * 8 * data.length, spacing); // lines for reference
    svg.selectAll("line.line")
        .data(lines)
        .join("line")
        .attr("class", "line")
        .attr("x1", scale(0))
        .attr("y1", d => d+(spacing/3))
        .attr("x2", scale(maxTime))
        .attr("y2", d => d+(spacing/3))
        .style("stroke", d3.scaleOrdinal(evts.map(d => d.color)))
        .style("stroke-width", spacing * 2 / 3)
        .style("opacity", 0.2);
}

/** Draw rectangles that represent scheduled transitions.
 * They will change color when they finish or are interrupted/cancelled
 *
 */
function drawScheduledTransitions(data) {
    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("id", d => d.name)
        .attr("y", d => d.position)
        .attr("x", d => d.parent ? scale(data[d.parent].delay + data[d.parent].duration) : scale(d.delay))
        .attr("width", d => scale(d.duration) - scale(0))
        .attr("height", spacing * 20 / 3)
        .style("fill", "gray")
        .style("stroke", "black")
        .style("fill-opacity", .3);
}