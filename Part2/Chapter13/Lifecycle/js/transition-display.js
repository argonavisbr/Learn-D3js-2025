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
 * @param trData
 */
function registerListeners(trData) {

    printLabels(trData);

    trData.transition.on("start", () => log(trData.name, evtsMap.get("on.start"), trData.position));
    trData.transition.tween("", () => t => log(trData.name, evtsMap.get("tween"), trData.position + spacing));

    trData.transition.on("interrupt", () => {
        log(trData.name, evtsMap.get("on.interrupt"), trData.position + spacing*2);
        trData.interrupted = true;
    });

    trData.transition.on("cancel", () => log(trData.name, evtsMap.get("on.cancel"), trData.position + spacing*3));
    trData.transition.on("end", () => log(trData.name, evtsMap.get("on.end"), trData.position + spacing*4));

    trData.transition.end()
        .then(() => { // Transition completed
            log(trData.name, evtsMap.get("end.resolve"), trData.position + spacing*5);
            d3.select("#"+trData.name).style("fill", "green").style("stroke", "green");
        })
        .catch(() => { // Transition did not complete
            log(trData.name, evtsMap.get("end.reject"), trData.position + spacing*6);
            if(trData.interrupted) {
                d3.select("#"+trData.name).style("fill", "gold").style("stroke", "darkorange");
            } else {
                d3.select("#"+trData.name).style("fill", "red").style("stroke", "red");
            }
        });
}

/**
 * Prints labels for the events on the right side of the screen
 * @param trData  The transition data
 */
function printLabels(trData) {

    const labels = evts.map(d => d.name);

    if(data.length > 1) {
        svg.append("text")
            .text(trData.name.replace("-", "."))
            .attr("class", "label")
            .attr("x", 10)
            .attr("y", trData.position + spacing * 3)
            .style("font-size", spacing)
            .style("fill", "black");
    }

    svg.selectAll(".label.event."+trData.name)
        .data(evts.map(d => d.color))
        .join("text")
        .attr("class", "label event "+trData.name)
        .attr("x", 60)
        .attr("y", (d,i) => trData.position + spacing * i + spacing/15)
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