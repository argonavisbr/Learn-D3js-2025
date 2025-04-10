import * as d3 from "https://cdn.skypack.dev/d3@7";

const nestedFile = "../data/sample-hierarchy.json";
const tabularFile = "../data/sample-hierarchy.csv";

// Simple 4-level hierarchy
export const nestedStructure = await d3.json(nestedFile);

// Simple tabular with references (can be stratified)
export const tabularStructure = await d3.csv(tabularFile, d3.autoType);

// For legacy code - TODO: remove this after updating code that uses it
export const simpleHierarchy = nestedStructure;
export const refTable = tabularStructure;