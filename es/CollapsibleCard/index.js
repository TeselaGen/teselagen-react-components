var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { Button, Classes, Icon } from "@blueprintjs/core";
import classNames from "classnames";
import "./style.css";

var CollapsibleCard = function (_Component) {
  _inherits(CollapsibleCard, _Component);

  function CollapsibleCard(props) {
    _classCallCheck(this, CollapsibleCard);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      open: true
    };

    _this.toggleCardInfo = function () {
      _this.setState({
        open: !_this.state.open
      });
    };

    _this.state = {
      open: !props.initialClosed
    };
    return _this;
  }

  CollapsibleCard.prototype.renderOpenCard = function renderOpenCard() {
    return this.props.children;
  };

  CollapsibleCard.prototype.render = function render() {
    var open = this.state.open;
    var _props = this.props,
        title = _props.title,
        icon = _props.icon,
        openTitleElements = _props.openTitleElements,
        _props$noCard = _props.noCard,
        noCard = _props$noCard === undefined ? false : _props$noCard,
        className = _props.className,
        style = _props.style;

    return React.createElement(
      "div",
      {
        className: classNames({ "tg-card": !noCard, open: open }, className),
        style: _extends({
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 15,
          paddingRight: 15
        }, style)
      },
      React.createElement(
        "div",
        { className: "tg-card-header", style: { marginBottom: 8 } },
        React.createElement(
          "div",
          { className: "tg-card-header-title" },
          icon && React.createElement(Icon, { icon: icon }),
          React.createElement(
            "h6",
            {
              style: {
                marginBottom: 0,
                marginRight: 10,
                marginLeft: 10
              }
            },
            title
          ),
          React.createElement(
            "div",
            null,
            open && openTitleElements
          )
        ),
        React.createElement(
          "div",
          null,
          React.createElement(Button, {
            icon: open ? "minimize" : "maximize",
            className: classNames(Classes.MINIMAL, "info-btn"),
            onClick: this.toggleCardInfo
          })
        )
      ),
      open && this.renderOpenCard()
    );
  };

  return CollapsibleCard;
}(Component);

export { CollapsibleCard as default };