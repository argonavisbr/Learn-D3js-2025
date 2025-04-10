/**
 * Returns a display string for a given value, title, and optional suffix.
 */
export function display(value, title, suffix = '') {
    if(!value) return;
    return `${title}: ${value}${suffix}`;
}

/**
 * Creates a nested table view of the given data structure.
 */
export function makeTable(element, root, props) {
    makeEntry(element.append("table").append("tr"), root, props);
}

function makeEntry(tr, entry, props) {
    if(entry.children) {
        const table = tr.append("td").attr("colspan", 100).append("table");
        
        appendRow(entry.data.id || entry.id, table, 100, "bold");
        props.values().forEach(v => appendRow(v(entry), table,100));
        
        entry.children.forEach(child => makeEntry(table.append("tr"), child, props));
    } else { // leaf
        appendCell(entry.data.id || entry.id, tr, 1,"leaf");
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