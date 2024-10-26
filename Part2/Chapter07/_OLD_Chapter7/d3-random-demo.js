const w = 500, h = 300, marginH = 40, marginW = 50;

const scaleX = d3.scaleLinear().range([marginW, w-marginW]);
const scaleY = d3.scaleLinear().range([h-.5, marginH]);
const color  = d3.scaleSqrt().range(["blue", "red"]);

const data = {}

function plot() {
    scaleX.domain([0, d3.max(data.thresholds)]);
    scaleY.domain([0, d3.max(data.bins, d => d.length)]);
    color.domain(scaleY.domain());

    draw();
}

function generateData(random) {
    data.values = []
    for(let i = 0; i < 10000; i++) {
        data.values.push(random() * 160);
    }
}

function makeHistogram(bucket, thresholds) {
    data.thresholds = d3.range(d3.min(data.values), d3.max(data.values), bucket);
    const histogram = d3.bin();//.thresholds(thresholds ? thresholds : data.thresholds);
    data.bins = histogram(data.values);
}

function draw() {
    const width = w / data.bins.length
    d3.select("svg")
        .append("g")
        .attr("transform", `translate(${[0,0]})`)
        .selectAll("rect.bar")
        .data(data.bins)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => scaleX(d.x0))
        .attr("width", width > 2 ? width-1 : width)
        .attr("y", d => scaleY(d.length))
        .attr("height", d => h-scaleY(d.length))
        .style("fill", d => color(d.length))

}