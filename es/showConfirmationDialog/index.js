var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { Alert, Intent } from "@blueprintjs/core";
import { renderOnDoc } from "../utils/renderOnDoc";

// usage
// const doAction = await showConfirmationDialog({
//   text:
//     "Are you sure you want to re-run this tool? Downstream tools with linked outputs will need to be re-run as well!",
//     intent: Intent.DANGER, //applied to the right most confirm button
//     confirmButtonText: "Yep!",
//     cancelButtonText: "Nope",
//     canEscapeKeyCancel: true //this is false by default
// });
// console.log("doAction:", doAction);
//returns a promise that resolves with true or false depending on if the user cancels or not!
export default function showConfirmationDialog(opts) {
  return new Promise(function (resolve) {
    renderOnDoc(function (handleClose) {
      return React.createElement(AlertWrapper, _extends({}, opts, { handleClose: handleClose, resolve: resolve }));
    });
  });
}

var AlertWrapper = function (_Component) {
  _inherits(AlertWrapper, _Component);

  function AlertWrapper() {
    var _temp, _this, _ret;

    _classCallCheck(this, AlertWrapper);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = { isOpen: true }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  AlertWrapper.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        handleClose = _props.handleClose,
        _props$text = _props.text,
        text = _props$text === undefined ? "customize like --  {text: 'your text here'} " : _props$text,
        resolve = _props.resolve,
        _props$cancelButtonTe = _props.cancelButtonText,
        cancelButtonText = _props$cancelButtonTe === undefined ? "Cancel" : _props$cancelButtonTe,
        _props$intent = _props.intent,
        intent = _props$intent === undefined ? Intent.PRIMARY : _props$intent,
        rest = _objectWithoutProperties(_props, ["handleClose", "text", "resolve", "cancelButtonText", "intent"]);

    var doClose = function doClose(confirm) {
      handleClose();
      _this2.setState({ isOpen: false });
      resolve(confirm);
    };
    return React.createElement(
      Alert,
      _extends({
        isOpen: this.state.isOpen,
        intent: intent,
        cancelButtonText: cancelButtonText,
        onCancel: function onCancel() {
          return doClose(false);
        },
        onConfirm: function onConfirm() {
          return doClose(true);
        }
      }, rest),
      React.createElement(
        "p",
        { style: { marginBottom: 10 } },
        text
      )
    );
  };

  return AlertWrapper;
}(Component);