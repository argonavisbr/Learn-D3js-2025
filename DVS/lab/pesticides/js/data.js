import * as d3 from "https://cdn.skypack.dev/d3@7";

export async function load(file) {
    const csv = await d3.csv(file, row => {
      //  if(row.Flag === 'A') {
            return {
                country: row.Area,
                value: +row.Value,
                year: +row.Year
            }
    //    }
    });

    return csv;
}