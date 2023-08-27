// used for extracting info from the wiki pages
// regex to remove things extra columns
// (^.+?,.+?,.+?),.+
// $1
const table = Array.from(document.getElementsByTagName('tbody'))[0];

const rows = Array.from(table.getElementsByTagName('tr'));

// remove header
rows.shift();

const rowsData = rows.map(row => Array.from(row.getElementsByTagName('td')).map(cell => cell.innerText.replace(/,/g, '.')));

rowsData.join('\n').replace(/^.+,,,,$/gm, '').replace(/\n$/gm, '');