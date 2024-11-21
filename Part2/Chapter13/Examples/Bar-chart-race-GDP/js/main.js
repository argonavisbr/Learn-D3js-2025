import {app, dim} from "./common.js";
import * as data from "./data.js";
import {start} from "./chart.js";

// Overriding application specific settings ======

// In this example, flags have different proportions, so we adjusted all to 3x2.
app.img = {
    directory: '../../data/flags/', // REQUIRED if using images. If null, images will not be loaded
    svgAspectRatio: "none",         // Default aspect ratio for the icons
    extraWidth: 2/3                 // How larger is width compared to height (0 = same width)
};

// The transition should be faster if there are more frames
app.transition = {duration: 200, numFrames: 12};

dim.width = 900;                    // We made it wider since most bars are small
app.numBars = 12;               // Number of countries to show
app.formatSpecifier = '.3s';        // Using SI format for labels
app.replaceBillions = true;         // Replace G (Giga) with B (Billions) to use SI format in labels

// Data source file location
const file = "../../data/un_gdp.csv";

// Load the data and run the application
data.load(file)
    .then(start);