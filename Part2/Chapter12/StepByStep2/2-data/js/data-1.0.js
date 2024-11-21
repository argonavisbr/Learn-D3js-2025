import * as d3 from "https://cdn.skypack.dev/d3@7";

export async function load(file) {
    const rawData = await d3.csv(file, row => {
        row.Decade = +row.Decade.split("-")[0] - 1;  // Parse decade as a number
        Object.entries(row).forEach(([k,v]) => {
            if (k !== "Decade") row[k] = +v;
        });
        return row;
    });

    return rawData;
}
