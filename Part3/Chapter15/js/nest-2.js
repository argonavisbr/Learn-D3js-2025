export function nest(data, levels, depth = 0) {
    if (depth >= levels)
        return data;
    if (depth === levels - 1)
        return data.map(d => ({key: d[0], value: d[1]}));
    else
        return data.map(d => ({key: d[0], values: nest(d[1], levels, depth + 1)}));
}

export function nest2(data, levels, depth = 0) {
    if (depth >= levels)
        return data
    if (depth === levels - 1)
        return data.map(d => nest2(d[1], levels, depth + 1));
    else
        return data.map(d => ({key: d[0], value: nest2(d[1], levels, depth + 1)}));
}