import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// GLOBAL CONSTANTS

// This object contains data used for the application
export const app = {
    planets: [],   // planetary data will be loaded from external file
    colors: ['#4169e1','#cc8530','#d4a450','#dab520','#7fffd4','#1e90ff']
}

// This object contains variables that change for each view
app.current = {
    moons: [],          // the moons to be displayed
    id: undefined,      // key to select current object
    planet: {},         // the object used in the current view
    color: "black"      // color of the planet
}
app.current.id = "p5"; // start with Jupiter id = "p5"

// A function that will scale the diameters in km to pixels
app.scale = d3.scaleLinear();

// Dimensions and spacing for the SVG graphics context
export const dim = {width: 500, height: 300, margin: {left: 20, right: 20, top: 50, bottom: 50}};
dim.margin.moon = 10;    // horiz space between moons
dim.margin.planet = 100; // horiz space reserved for the planet
