/**
 * Utility function to display hierarchies as an HTML table with nested cells.
 */

/**
 * Returns a display string for a given value, title, and optional suffix.
 * Use this to generate the strings to store in the map used by makeTable.
 */
export function display(value, title, suffix = '', formatter = (v) => v) {
    if(!value) return;
    return `${title}: ${formatter(value)}${suffix}`;
}

/**
 * Creates a nested table view of the given data structure.
 * @param {HTMLElement} element - A selection containing the parent element to append the table to.
 * @param {Object} root - The root node of the hierarchy (output from d3.hierarchy or d3.stratify).
 * @param {Object} props - A Map containing properties to display. Key = property key, Value = string.
 * @param {Function} nameAccessor - An accessor to the property that contains the name
 *        or ID of the node to display (default d => d.id).
 */
export function makeTable(element, root, props, nameAccessor = d => d.id) {
    makeEntry(element.append("table").append("tr"), root, props, nameAccessor);
}

function makeEntry(tr, entry, props, nameAccessor) {
    if(entry.children) {
        const table = tr.append("td").attr("colspan", 100).append("table");
        
        appendRow(nameAccessor(entry), table, 100, "bold");
        props.values().forEach(v => appendRow(v(entry), table,100));
        
        entry.children.forEach(child => makeEntry(table.append("tr"), child, props, nameAccessor));
    } else { // leaf
        appendCell(nameAccessor(entry), tr, 1,"leaf");
        props.values().forEach(v => appendCell(v(entry), tr));
    }
}

function appendRow(value, table, span, className) {
    if(value) {
        return table.append("tr")
                    .append("td")
                    .attr("colspan", span)
                    .attr("class", className).html(value);
    }
}

function appendCell(value, tr, span=1, className) {
    if(value) {
        return tr.append("td")
                 .attr("colspan", span)
                 .attr("class", className).html(value);
    }
}