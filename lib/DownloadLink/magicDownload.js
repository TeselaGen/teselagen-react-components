"use strict";

exports.__esModule = true;
exports.default = magicDownload;
/**
 * 
 * @param {string} text 
 * @param {string} fileName 
 * @param {string} type 
 */
var mime = require('mime-types');

function magicDownload(text, fileName, type) {
  var blob = new Blob([text], {
    type: type || mime.lookup(fileName) || "text/csv;charset=utf8;"
  });

  // create hidden link
  var element = document.createElement("a");
  document.body.appendChild(element);
  element.setAttribute("href", window.URL.createObjectURL(blob));
  element.setAttribute("download", fileName);
  element.style.display = "";

  element.click();

  document.body.removeChild(element);
}
module.exports = exports["default"];