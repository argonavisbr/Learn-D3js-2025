import * as view from "./view-1.7.js";
import * as data from "./data-1.3.js";
import * as animation from "./animation-1.2.js";

// Data source file location
const file = "../../data/un_gdp.csv";

// Load the data and run the application
data.load(file)
    .then(() => {
        view.draw();
        animation.start();
    });