export default function getSelectedRowsFromRegions(regions) {
  let selectedRows = [];
  regions.forEach(function(region) {
    let lowEnd = region.rows[0];
    let highEnd = region.rows[1];
    for (let i = lowEnd; i <= highEnd; i++) {
      selectedRows.push(i);
    }
  });
  return sort_unique(selectedRows);
}

function sort_unique(arr) {
  return arr.sort().filter(function(el, i, a) {
    return i === a.indexOf(el);
  });
}
