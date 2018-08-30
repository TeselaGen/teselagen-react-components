"use strict";

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// use like: 
// <FillWindow>
//         {({ width, height }) => {
//           return <div style={{width, height}}></div>
//         }
// <FillWindow/>


var FillWindow = function (_React$Component) {
  _inherits(FillWindow, _React$Component);

  function FillWindow() {
    var _temp, _this, _ret;

    _classCallCheck(this, FillWindow);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.updateDimensions = (0, _lodash.debounce)(function () {
      if (_this.props.disabled) return;
      _this.setState({ randomRerenderTrigger: Math.random() });
    }, 100), _temp), _possibleConstructorReturn(_this, _ret);
  }

  FillWindow.prototype.componentDidMount = function componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  };

  FillWindow.prototype.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  };

  FillWindow.prototype.render = function render() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName("body")[0],
        width = w.innerWidth || e.clientWidth || g.clientWidth,
        height = w.innerHeight || e.clientHeight || g.clientHeight;
    var windowDimensions = {
      width: width,
      height: height
    };
    var _props$containerStyle = this.props.containerStyle,
        containerStyle = _props$containerStyle === undefined ? {} : _props$containerStyle;

    if (this.props.disabled) return this.props.children(windowDimensions);
    return _react2.default.createElement(
      "div",
      { style: _extends({ width: width, height: height, position: "fixed", top: 0, left: 0, background: "white" }, containerStyle) },
      this.props.children && this.props.children(windowDimensions)
    );
  };

  return FillWindow;
}(_react2.default.Component);

exports.default = FillWindow;
module.exports = exports["default"];