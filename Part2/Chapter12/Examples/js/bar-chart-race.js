// ====== Configurable parameters (override them in the page)

// Icon configuration
// Directory where the icons are stored (the file name is the "Type" column + ".png" (e.g. bat.png)
let imgDir = null; // REQUIRED if using images. If null, images will not be loaded

let imgSVGAspectRatio = "xMidYMid meet"; // Default aspect ratio for the icons
let imgExtraWidth = 0;   // How larger is width compared to height (0 = same width)
let numBars = 10;        // Number of bars to display (the ones with the highest values will be displayed)

// Frames are used to produce keyframes that interpolate between data points.
// This will interpolate values and make the bars grow and shrink slower than
// they change rank. The result is that the transition will run smoother.
let dur = 600;   // duration of the transition that changes the order of the bars
let numFrames = 30;      // multiplies the duration and affects the transition that changes the lengths of the bars

// Label configuration
let formatSpecifier = '.2f';    // A format string for the values (default is decimal)
let replaceBillions = false;  // Replace the "G" in large SI (format "s") values with "B" (for billions)

// Chart dimensions
let barHeight = 40; // chart height is computed based on this value, unless overriden
const dim = {width: 800,
                  height: barHeight * numBars - 20,
                  margin: {top: 15, right: 10, bottom: 5, left: 100}};


// ====== Chart parameters, scales, axes, etc. (derived)
// Formatting function
let fmt = null; // initialized in init

// Initialized in verifyData - based on existing icon and category properties
let useIcon = false;
let useCategory = false;

// A color scale
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// The x scale will fit the values for each bar. Since the data will be updated during the animation,
// the domain will be computed later for every step.
const scaleX = d3.scaleLinear();

// The y scale will map a bar's rank to a y position. The domain will contain the number of bars + 1,
// reflected in the range, which adds dim.height/n. This will allow the entering/leaving bars to appear
// at the bottom of the chart.
const scaleY = d3.scaleBand();

// The axis will be at the top of the chart and the ticks will grow towards the bottom
// It will be updated as the values and scale changes
const axis = d3.axisTop().tickSizeOuter(0)

// An object to store maps used to retrieve chart data in update functions
// After initialization will contain: nxt, prv, data, keys, cats, icons, state, paused
const chart = {};

chart.paused = false;  // true when user pauses animation
chart.state = 0;       // saves the frame number when paused, which is retrieved when animation resumes



// ##### A) Functions that are called from the page ======
/**
 * Sets up the scales, data, and the graphical elements.
 * @param data
 * @returns {false|boolean}
 */
function createChart(data) {
    // Check data for consistency
    const errors = verifyData(data);
    errors.forEach(e => {
        d3.select("body")
            .append("h3").style("color", "red")
            .text("Configuration error: " + e);
    })
    if (errors.length > 0) {
        return false;
    }

    let success = true;
    success &&= init();
    success &&= prepareData(data);
    success &&= renderChart();
    return success;
}

/**
 * Starts the animation.
 */
function start() {
    animate(0);
}



// ##### B) Initialization and configuration ======

/**
 * Initializes the chart parameters and scales (called from createChart)
 */
function init() {
    fmt = d3.format(formatSpecifier);
    scaleY.domain(d3.range(numBars+1)) // + 1 line to display entering/leaving bars at bottom
          .range([dim.margin.top, dim.height - dim.margin.bottom + dim.height/numBars])
          .padding(0.1);
    scaleX.range([dim.margin.left, dim.width - dim.margin.right]);
    axis.scale(scaleX)
        .tickSizeInner(-dim.height + dim.margin.top + dim.margin.bottom)
        .ticks(dim.width / 100, "s")
        .tickFormat(d => replaceBillions ? fmt(d).replace("G", 'B') : fmt(d));
    return true;
}

/**
 * Checks if the data is in the correct format: {name, date, value}
 * If data contains the icon property, it checks if the icon directory is set.
 * Sets flags for using icons and categories if the data contains the icon and category properties.
 * @param data
 * @returns {*[]}
 */
function verifyData(data) {
    const configErrors = [];
    if(data[0].category) {
        useCategory = true;
    }
    if(data[0].icon) {
        useIcon = true;
        if (imgDir === null) {
            configErrors.push("Icons are enabled, but the icon directory is not set.");
        }
    }
    if (!(data[0].name && data[0].date && data[0].value)) {
        configErrors.push("Invalid data structure: missing name, date or value properties.");
    }
    return configErrors;
}



// ##### C) Data preparation ======

/**
 * Prepares the data for the chart which can be accessed from the chartData object.
 * @param data
 * @returns {boolean}
 */
function prepareData(data) {

    // 1) Get a set of unique names that will be used as keys, replacing spaces for "-" in names.
    chart.keys = new Set(data.map(d => d.name));

    // 2) If there are categories, create a map to get them (we will use them for the colors)
    if (useCategory) {
        chart.cats = new Map(data.map(d => [d.name, d.category]));
        colorScale.domain(Array.from(chart.cats.values()));
    }

    // 3) If there are icons, create a map to get them (we will use them to add an image for each bar)
    if (useIcon) {
        chart.icons = new Map(data.map(d => [d.name, d.icon]));
    }

    // 4) Create a nested map of values per date and then name, convert to array and sort by date
    const byDate = d3.rollup(data,
                                v => v[0].value,
                                d => d.date,
                                   d => d.name);

    const byDateArray = Array.from(byDate)
                                        .sort((a, b) => d3.ascending(a[0], b[0]));

    // 5) Create interpolated values between dates for a slower bar length transition
    //    and rank the elements using the intermediate (interpolated) values
    const intermediateFrames = [];
    for ([a, b] of d3.pairs(byDateArray)) {             // pairs of [date, data] objects
        for (let i = 0; i < numFrames; ++i) {
            const t = i / numFrames;
            intermediateFrames.push([
                a[0] * (1 - t) + b[0] * t,                  // will create intermediate dates
                rank(valueFactory(a, b, t), chart.keys)     // will create an array of intermediate {name, value, rank} objects
            ]);
        }
    }

    // ======== Maps to retrieve data elements ========
    // 1) Map with all the keys and their intermediate values and ranks. This is used to
    //    configure the nextMap and prevMap maps.
    const dataMap = d3.groups(intermediateFrames.flatMap(([, data]) => data), d => d.name);

    // 2) Map that gets the next object, given the current one
    const nextMap = new Map(dataMap.flatMap(([_, data]) => d3.pairs(data)));
    chart.nxt = d => nextMap.get(d) || d; // function that gets next data frame

    // 3) Map that gets the previous object, given the current one
    const prevMap = new Map(dataMap.flatMap(([_, data]) => d3.pairs(data).map(([a, b]) => [b, a])));
    chart.prv = d => prevMap.get(d) || d;

    // Save data frames in the global chart object
    chart.data = intermediateFrames;

    return true;
}

/**
 * Used only in prepareData().
 * Interpolator factory to generate intermediate values. Returns a function that
 * gets the value, given the key.
 */
function valueFactory(a,b,t) {
    return k => (a[1].get(k) || 0) * (1 - t) + (b[1].get(k) || 0) * t;
}

/**
 * Used only in prepareData().
 * Rank the values using intermediate values. This will add a "rank" property to each object.
 */
function rank(getValue, keys) {
    const data = Array.from(keys)
                              .map(k => ({name: k, value: getValue(k)}));
    data.sort((a, b) => d3.descending(a.value, b.value));
    for (let i = 0; i < data.length; ++i) {
        data[i].rank = Math.min(numBars, i); // will assign rank = i to the numBars top objects, and numBars to the others
    }
    return data;
}



// ##### D) Graphics and transitions ======

/**
 * Renders the graphical elements (SVG) in the chart.
 * @returns {boolean}
 */
function renderChart() {

    // 1) Create the SVG
    const svg = d3.select("body")
                  .append("svg")
                     .attr("class", "chart")
                     .attr("width", dim.width)
                     .attr("height", dim.height);

    // 2) Create clipping paths for the images in bars (to clip the image if the bar is smaller)
    if(useIcon) {
        createClipping(svg, numBars);
    }

    // 3) Create the axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${dim.margin.top})`);

    // 4) A label to display each year
    svg.append("text")
        .attr("class", "step label")
        .attr("x", dim.width - 5)
        .attr("y", dim.height - dim.margin.bottom);

    // 5) A container for the chart entries (bars + labels + icons)
    svg.append("g")
        .attr("class", "entries");

    svg.on("click", togglePause); // adds a click event to pause/resume the animation

    return true;
}

/**
 * A transition factory. Returns a pre-configured transition object.
 * @returns {*}
 */
function getTransition() {
    return d3.transition().duration(dur).ease(d3.easeLinear);
}

/**
 * Make an ID usable in SVG, given a readable name (replaces spaces for "_")
 * @param name
 * @returns {*}
 */
function makeID(name) {
    return name.replace(" ","_");
}




// ##### E) Internal functions that are called during the animation

/**
 * Main animation function. It will repeat the transition for each data frame.
 * @param i
 */
function animate(i) {

    const svg = d3.select("svg");

    svg.transition(getTransition())
        .on("interrupt", () => { // interrupts the transition (pausing the animation)
            chart.state = i; // saves the current frame number, to be used when resuming the animation
        })
       .end()
       .then(() => {
            updateChart(svg, chart.data[i]); // update function
            if(i < chart.data.length - 1) {
                animate(++i);
            }
       })
        .catch(() => {
            console.log("Animation paused at frame " + i + ".");
            chart.paused = true;
        });
}


/**
 * Pauses and resumes the animation. Current frame number is saved in chart.state (see interrupt handler in animate() function)
 * @param e
 */
function togglePause(e) {
    if(chart.paused) {  // if chart is paused, then resume
        chart.paused = false;
        animate(chart.state); // continue animation from frame that was interrupted
        console.log("Animation resumed from frame " + chart.state + ".");
    } else {
        d3.select("svg.chart").interrupt(); // interrupt the main transition (chart state is saved in event handler)
    }
}

/**
 * Updates the chart with the current data frame.
 * @param container
 * @param dataFrame
 */
function updateChart(container, dataFrame) {

    const [date, data] = dataFrame;

    // updates the x-scale and axis
    scaleX.domain([0, data[0].value * 1.1]);
    d3.select(".axis")
        .transition(getTransition())
        .call(axis);

    d3.select(".step.label").text(Math.round(date)); // updates the date label
    updateBars(container, data);  // updates the bars and labels

}

/**
 * Used in updateBars to get the color of the bar. Will use the category if available,
 * otherwise it will use the key itself for colors (colors will repeat after 10 elements).
 * @param key
 * @returns {*}
 */
function color(key) {
    if(useCategory) {
        return colorScale(chart.cats.get(key));
    }
    return colorScale(key); // using the name as a key for colors
}

/**
 * Used in updateBars to get the URL of the image, if the bar has an icon.
 * @param key
 * @returns {string}
 */
function icon(key) {
    return imgDir + chart.icons.get(key) + '.png';
}

/**
 * Creates clipping paths (in SVG) for the icons in the bars, if icons are used. This will clip the image
 * if the bar is shorter than the image.
 * @param container
 */
function createClipping(container) {
    container.append("defs")
             .selectAll("clipPath")
                .data(chart.keys)
                    .join("clipPath")
                    .attr("id", d => `clip-${makeID(d)}`)
                    .append("use")
                        .attr("xlink:href", d => `#bar-${makeID(d)}`);
}



// ##### F) Internal functions used for data updates

/**
 * Updates the bars. It will create, update and remove bars as needed. Bars are g.entry elements and contain
 * a rect.bar element for the bar itself, a text.name.label for the name, and a text.value.label for the value.
 * If icons are used, it will also contain an image.bar element. Updates change the vertical position of the
 * g.entry elements, the width of the rect.bar elements, the x positions of the image.bar elements, and the
 * text.value.label. The text.value.label element will also change its text (in a tween).
 *
 * @param container
 * @param data
 */

function updateBars(container, data) {
    // Short helper functions for previous, next and final width of the bars
    const pw = d => scaleX(chart.prv(d).value) - scaleX(0); // previous width
    const nw = d => scaleX(chart.nxt(d).value) - scaleX(0); // next width
    const fw = d => scaleX(d.value) - scaleX(0); // final width

    const entry =
        container.select(".entries")
                 .selectAll("g.entry")
                 .data(data.slice(0, numBars), d => d.name)
                 .join(
                    enter => {
                        const enterGrp =
                            enter.append("g")
                                 .attr("class", "entry")
                                 .attr("transform", d => `translate(${scaleX(0)},${scaleY(chart.prv(d).rank)})`)
                                 .style("opacity", d => chart.prv(d).rank <= numBars - 1 ? 1 : 0);

                        enterGrp.append("rect")
                             .attr("class", "bar")
                             .attr("id", d => `bar-${makeID(d.name)}`)
                             .attr("height", scaleY.bandwidth())
                             .style("fill", d => color(d.name))
                             .attr("width", pw)

                        if(useIcon) {
                            enterGrp.append("image")
                                .attr("class", "bar")
                                .attr("preserveAspectRatio", imgSVGAspectRatio)
                                .attr("xlink:href", d => icon(d.name))
                                .attr("height", scaleY.bandwidth())
                                .attr("width", scaleY.bandwidth() * (1 + imgExtraWidth))
                                .attr("x", d => pw(d) - scaleY.bandwidth() * (1 + imgExtraWidth))
                                .attr("clip-path", d => `url(#clip-${makeID(d.name)})`)
                        }

                        enterGrp.append("text")
                            .attr("class", "name label")
                            .attr("y", scaleY.bandwidth()/2)
                            .attr("x", -5) // and align right
                            .style("text-anchor", "end")
                            .text(d => d.name)

                        enterGrp.append("text")
                             .attr("class", "value label")
                             .attr("y", scaleY.bandwidth()/2)
                             .attr("x", d => pw(d) + 5)
                             .text(d => d.value)

                        return enterGrp;
                    },
                    update => update,
                    exit => {
                        const exitGrp =
                            exit.transition(getTransition())
                                .attr("transform", d => `translate(${scaleX(0)},${scaleY(chart.nxt(d).rank)})`)
                                .style("opacity", 0)

                        exitGrp.select("rect.bar")
                               .attr("width", nw)
                        exitGrp.select("image.bar")
                               .attr("x", d => nw(d) - scaleY.bandwidth() * (1 + imgExtraWidth))
                        exitGrp.select("text.value.label")
                               .attr("x", d => nw(d) + 5)
                               .textTween(function(d) {
                                  const i = d3.interpolateNumber(chart.nxt(d).value, d.value);
                                  return t => replaceBillions ? fmt(i(t)).replace("G", 'B') : fmt(i(t));
                               })

                        return exitGrp.remove();
                    }
                ).transition(getTransition())
                 .attr("transform", d => `translate(${scaleX(0)},${scaleY(d.rank)})`)
                 .style("opacity", 1)

    entry.select("rect.bar").attr("width", fw)
    entry.select("image.bar").attr("x", d => fw(d) - scaleY.bandwidth() * (1 + imgExtraWidth))
    entry.select("text.value.label")
         .attr("x", d => fw(d) + 5)
         .textTween(function(d) {
             const i = d3.interpolateNumber(chart.prv(d).value, d.value);
             return t => replaceBillions ? fmt(i(t)).replace("G", 'B') : fmt(i(t));
         });
}