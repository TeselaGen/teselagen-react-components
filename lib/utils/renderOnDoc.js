"use strict";

exports.__esModule = true;
exports.renderOnDoc = renderOnDoc;
exports.renderOnDocSimple = renderOnDocSimple;

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderOnDoc(fn) {
  var elemDiv = document.createElement("div");
  elemDiv.style.cssText = "position:absolute;width:100%;height:100%;top:0px;opacity:0.3;z-index:0;";
  document.body.appendChild(elemDiv);
  var handleClose = function handleClose() {
    setTimeout(function () {
      _reactDom2.default.unmountComponentAtNode(elemDiv);
      document.body.removeChild(elemDiv);
    });
  };
  return _reactDom2.default.render(fn(handleClose), elemDiv);
}
function renderOnDocSimple(el) {
  var elemDiv = document.createElement("div");
  elemDiv.style.cssText = "position:absolute;width:100%;height:100%;top:0px;opacity:1;z-index:10000;";
  document.body.appendChild(elemDiv);
  var handleClose = function handleClose() {
    setTimeout(function () {
      _reactDom2.default.unmountComponentAtNode(elemDiv);
      document.body.removeChild(elemDiv);
    });
  };
  _reactDom2.default.render(el, elemDiv);
  return handleClose;
}