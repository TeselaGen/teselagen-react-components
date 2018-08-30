var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import magicDownload from "./magicDownload";

var DownloadLink = function (_React$Component) {
  _inherits(DownloadLink, _React$Component);

  function DownloadLink() {
    var _temp, _this, _ret;

    _classCallCheck(this, DownloadLink);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleDownloadClick = function (event) {
      var _this$props = _this.props,
          getFileString = _this$props.getFileString,
          filename = _this$props.filename,
          fileString = _this$props.fileString;


      var fileType = event.target.innerText;

      var text = getFileString ? getFileString(fileType) : fileString;
      if (text instanceof Promise) {
        text.then(function (result) {
          return magicDownload(result, filename);
        });
      } else {
        magicDownload(text, filename);
      }
      event.stopPropagation();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  DownloadLink.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        filename = _props.filename,
        getFileString = _props.getFileString,
        file = _props.file,
        rest = _objectWithoutProperties(_props, ["children", "filename", "getFileString", "file"]);

    return React.createElement(
      "a",
      _extends({ onClick: this.handleDownloadClick }, rest),
      children
    );
  };

  return DownloadLink;
}(React.Component);

export { DownloadLink as default };