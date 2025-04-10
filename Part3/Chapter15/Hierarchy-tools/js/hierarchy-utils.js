/*
* This module provides a function to convert a nested Map into a hierarchy of nested objects
* suitable for use with d3-hierarchy tools.
*/

import * as d3 from "https://cdn.skypack.dev/d3@7";

// Provide a nested Map and a name for the root node
export function makeHierarchy(nested, name, isUnique = false) {
    const root = {id: name, children: []};
    const data = nested.get(name);
    return makeChildren(root, data ? nested.get(name) : nested, isUnique)
}

// Recursively create children for a node in the hierarchy
function makeChildren(node, data, isUnique = false) {
    const entries = data.entries();

    entries.forEach(([key, value]) => {
            const child = {id: key, children: []};
            if (value instanceof Map) {
                if(!isUnique && key === node.id) {   // skip duplicated ndes
                    return makeChildren(node, value);
                } else {
                    node.children.push(child);
                    return makeChildren(child, value);
                }
            } else {
                node.children.push(child);
                return child.value = value;
            }
        });
    return node;
}

export function makeLinePairs(data) {
    return data.links().map(d => {
        const pair = [[d.source.y, d.source.x]];
        pair.push([d.target.y, d.target.x]);
        return pair;
    });
}

export function tabularToHierarchy(data, rootKey, ...keyFunctions) {
    // 1) Convert the tabular data to a nested object structure
    const nested = d3.rollup(data, v => v, ...keyFunctions);
    console.log(nested)

    // 2) Create nested objects to a hierarchical structure for d3.hierarchy
    const objTree = makeHierarchy(nested, rootKey);

    // 3) Return the hierarchy structure to build any node-link diagram
    return d3.hierarchy(objTree);
}