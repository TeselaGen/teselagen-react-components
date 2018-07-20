/**
 * 
 * @param {string} text 
 * @param {string} fileName 
 * @param {string} type 
 */
const mime = require('mime-types')

export default function magicDownload(text, fileName, type) {
  let blob = new Blob([text], {
    type: type || mime(fileName) || "text/csv;charset=utf8;"
  });

  // create hidden link
  let element = document.createElement("a");
  document.body.appendChild(element);
  element.setAttribute("href", window.URL.createObjectURL(blob));
  element.setAttribute("download", fileName);
  element.style.display = "";

  element.click();

  document.body.removeChild(element);
}
