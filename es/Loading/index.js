var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import DNALoader from "../DNALoader";
import BounceLoader from "../BounceLoader";
import "./style.css";

var Loading = function (_React$Component) {
  _inherits(Loading, _React$Component);

  function Loading() {
    var _temp, _this, _ret;

    _classCallCheck(this, Loading);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      longerThan200MS: false
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Loading.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    this.timeoutId = setTimeout(function () {
      _this2.setState({
        longerThan200MS: true
      });
    }, 200);
  };

  Loading.prototype.componentWillUnmount = function componentWillUnmount() {
    clearTimeout(this.timeoutId);
  };

  Loading.prototype.render = function render() {
    var _props = this.props,
        loading = _props.loading,
        userStyle = _props.style,
        className = _props.className,
        _props$containerStyle = _props.containerStyle,
        containerStyle = _props$containerStyle === undefined ? {} : _props$containerStyle,
        children = _props.children,
        _props$displayInstant = _props.displayInstantly,
        displayInstantly = _props$displayInstant === undefined ? false : _props$displayInstant,
        _props$bounce = _props.bounce,
        bounce = _props$bounce === undefined ? false : _props$bounce,
        withTimeout = _props.withTimeout,
        inDialog = _props.inDialog;
    var longerThan200MS = this.state.longerThan200MS;

    var style = _extends({}, userStyle, inDialog && { minHeight: 120 });
    var LoaderComp = bounce || inDialog ? BounceLoader : DNALoader;

    if (loading || !children) {
      if (!displayInstantly && !longerThan200MS && (!bounce && !inDialog || withTimeout)) {
        return React.createElement("div", null);
      }
      return React.createElement(
        "div",
        {
          className: "tg-loader-container tg-flex justify-center align-center",
          style: _extends({
            width: "100%"
          }, containerStyle)
        },
        React.createElement(LoaderComp, { style: style, className: className })
      );
    } else {
      return children || null;
    }
  };

  return Loading;
}(React.Component);

export { Loading as default };