"use strict";

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _core = require("@blueprintjs/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InfoHelper = function (_Component) {
  _inherits(InfoHelper, _Component);

  function InfoHelper() {
    _classCallCheck(this, InfoHelper);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  InfoHelper.prototype.render = function render() {
    var _props = this.props,
        className = _props.className,
        content = _props.content,
        children = _props.children,
        _props$icon = _props.icon,
        icon = _props$icon === undefined ? "info-sign" : _props$icon,
        isPopover = _props.isPopover,
        isButton = _props.isButton,
        size = _props.size,
        _props$popoverProps = _props.popoverProps,
        popoverProps = _props$popoverProps === undefined ? {} : _props$popoverProps,
        disabled = _props.disabled,
        displayToSide = _props.displayToSide,
        style = _props.style,
        rest = _objectWithoutProperties(_props, ["className", "content", "children", "icon", "isPopover", "isButton", "size", "popoverProps", "disabled", "displayToSide", "style"]);

    var IconToUse = isButton ? _core.Button : _core.Icon;
    var IconInner = _react2.default.createElement(IconToUse, _extends({
      icon: icon,
      className: className,
      iconSize: size,
      disabled: disabled
    }, rest));
    var toReturn = void 0;
    if (displayToSide) {
      toReturn = _react2.default.createElement(
        _react2.default.Fragment,
        null,
        IconInner,
        _react2.default.createElement(
          "span",
          { style: { paddingLeft: 5, fontStyle: "italic" } },
          content || children
        )
      );
    } else if (isPopover) {
      toReturn = _react2.default.createElement(_core.Popover, _extends({
        disabled: disabled,
        popoverClassName: _core.Classes.DARK,
        target: _react2.default.createElement(_core.Button, {
          style: { borderRadius: 15, borderWidth: 5 },
          minimal: true,
          className: className,
          icon: icon
        }),
        content: _react2.default.createElement(
          "div",
          { style: { padding: 5 } },
          content || children
        )
      }, popoverProps));
    } else {
      toReturn = _react2.default.createElement(_core.Tooltip, _extends({
        disabled: disabled,
        target: IconInner,
        content: content || children
      }, popoverProps));
    }
    return _react2.default.createElement(
      "div",
      {
        style: _extends({ display: "flex" }, style),
        className: "info-helper-wrapper"
      },
      toReturn
    );
  };

  return InfoHelper;
}(_react.Component);

exports.default = InfoHelper;
module.exports = exports["default"];