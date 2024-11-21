import {app, dim} from "./common.js";
import * as data from "./data.js";
import {start} from "./chart.js";

// Load the data and run the application
data.load()
    .then(start);