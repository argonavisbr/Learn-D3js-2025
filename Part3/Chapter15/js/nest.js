/**
 * Function that produces a d3.nest() equivalent output, given the results of a d3.rollups() operation.
 * levels: number of key functions passed to the d3.rollups() operation
 */
export function nest(data, levels, depth = 0) {
    if (depth >= levels)
        return data;
    if (depth === levels - 1)
        return data.map(d => ({key: d[0], value: d[1]}));
    else
        return data.map(d => ({key: d[0], values: nest(d[1], levels, depth + 1)}));
}

/**
 * Alternative function that produces a d3.nest() equivalent output, given the results of a d3.rollups() operation.
 * TODO: Review this to keep only one version - check uses!
 * @param data
 * @param levels
 * @param depth
 * @returns {*}
 */
export function nest2(data, levels, depth = 0) {
    if (depth >= levels)
        return data
    if (depth === levels - 1)
        return data.map(d => nest2(d[1], levels, depth + 1));
    else
        return data.map(d => ({key: d[0], value: nest2(d[1], levels, depth + 1)}));
}

/**
 * Data structure formatting for d3.nest type hierarchies
 */
export function rootFromNest(nested, name) {
    return makeSubtree({ key: name, values: nested });
}

function makeSubtree(item) {
    const object = { id: item.key };
    if (item.value) {
        Object.assign(object, item.value);
    } else if (item.values) {
        object.children = item.values.map(d => makeSubtree(d));
    }
    return object;
}

/**
 * Data structure formatting for d3.rollup type hierarchies
 */
export function rootFromRollup(rollupRoot, name) {
    const root = {id: name, children: []};
    const data = rollupRoot.get(name);
    return makeChildren(root, data ? data : rollupRoot)
}

function makeChildren(node, data) {
    data.entries().forEach(([key, value]) => {
        const child = {id: key, children: []};
        if (value instanceof Map) {
            if(key === node.id) {   // skip duplicated nodes
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

/**
 * For path links that don't use d3.link.
 * @param data
 * @returns {*}
 */
export function makeLinePairs(data) {
    return data.links().map(d => {
        const pair = [[d.source.y, d.source.x]];
        pair.push([d.target.y, d.target.x]);
        return pair;
    });
}