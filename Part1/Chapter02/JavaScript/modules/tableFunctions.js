import style from './style.js';
import * as color from './colors.js';

style.innerText =
    ` table,td,th {border: solid 2px ${color.red};}
      td,th {padding: 5px;}
      th {border-color: ${color.random()};}
    `;

export function makeTable(tableData) {
    const table = document.createElement('table');
    tableData.forEach((row, i) => table.appendChild(makeRow(row, i === 0)));
    return table;
}

export function append(table, container) {
    if (container) {
        container.appendChild(table);
    } else {
        document.body.appendChild(table);
    }
}

function makeRow(rowData, isHeader = false) {
    const row = document.createElement('tr');
    rowData.forEach(cell => row.appendChild(makeCell(cell, isHeader)));
    return row;
}

function makeCell(cellData, isHeader = false) {
    const cell = document.createElement(isHeader ? 'th' : 'td');
    cell.textContent = cellData;
    return cell;
}