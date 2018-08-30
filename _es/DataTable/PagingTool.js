var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import { withProps, withHandlers, compose } from "recompose";
import classNames from "classnames";

import { noop, get } from "lodash";
import { Button, Classes } from "@blueprintjs/core";
import { pageSizes } from "./utils/queryParams";
import { onEnterOrBlurHelper } from "../utils/handlerHelpers";

export var PagingTool = (_temp2 = _class = function (_React$Component) {
  _inherits(PagingTool, _React$Component);

  function PagingTool() {
    var _temp, _this, _ret;

    _classCallCheck(this, PagingTool);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      selectedPage: 1
    }, _this.onRefresh = function () {
      _this.props.onRefresh();
    }, _this.setPage = function (page) {
      _this.props.setPage(page);
      _this.props.onPageChange(page);
    }, _this.setPageSize = function (e) {
      _this.props.setPageSize(parseInt(e.target.value, 10));
    }, _this.pageBack = function () {
      var page = _this.props.paging.page;

      _this.setPage(parseInt(page, 10) - 1);
    }, _this.pageForward = function () {
      var page = _this.props.paging.page;

      _this.setPage(parseInt(page, 10) + 1);
    }, _this.setSelectedPage = function (e) {
      _this.setState({
        selectedPage: e.target.value
      });
    }, _this.pageInputBlur = function (e) {
      var _this$props$paging = _this.props.paging,
          pageSize = _this$props$paging.pageSize,
          total = _this$props$paging.total;

      var lastPage = Math.ceil(total / pageSize);
      var pageValue = parseInt(e.target.value, 10);
      var selectedPage = pageValue > lastPage ? lastPage : pageValue < 1 || isNaN(pageValue) ? 1 : pageValue;

      _this.setState({
        selectedPage: selectedPage
      });
      _this.setPage(selectedPage);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  PagingTool.prototype.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
    var page = nextProps.paging.page;

    this.setState({
      selectedPage: page
    });
  };

  PagingTool.prototype.render = function render() {
    var selectedPage = this.state.selectedPage;
    var _props = this.props,
        _props$paging = _props.paging,
        pageSize = _props$paging.pageSize,
        page = _props$paging.page,
        total = _props$paging.total,
        onRefresh = _props.onRefresh,
        disabled = _props.disabled;

    var pageStart = (page - 1) * pageSize + 1;
    if (pageStart < 0) throw new Error("We should never have page be <0");
    var backEnabled = page - 1 > 0;
    var forwardEnabled = page * pageSize < total;
    var lastPage = Math.ceil(total / pageSize);

    return React.createElement(
      "div",
      { className: "paging-toolbar-container" },
      onRefresh && React.createElement(Button, {
        minimal: true,
        icon: "refresh",
        disabled: disabled,
        onClick: this.onRefresh
      }),
      React.createElement(
        "div",
        { className: classNames(Classes.SELECT, Classes.MINIMAL) },
        React.createElement(
          "select",
          {
            className: "paging-page-size",
            onChange: this.setPageSize,
            disabled: disabled,
            value: pageSize
          },
          [React.createElement(
            "option",
            { key: "page-size-placeholder", disabled: true, value: "fake" },
            "Set Page Size"
          )].concat(pageSizes.map(function (size) {
            return React.createElement(
              "option",
              { key: size, value: size },
              size
            );
          }))
        )
      ),
      React.createElement(Button, {
        onClick: this.pageBack,
        disabled: !backEnabled || disabled,
        minimal: true,
        className: "paging-arrow-left",
        icon: "chevron-left"
      }),
      React.createElement(
        "div",
        null,
        total ? React.createElement(
          "div",
          null,
          React.createElement("input", _extends({
            style: { marginLeft: 5, width: 35, marginRight: 8 },
            value: selectedPage,
            disabled: disabled,
            onChange: this.setSelectedPage
          }, onEnterOrBlurHelper(this.pageInputBlur), {
            className: Classes.INPUT
          })),
          "of ",
          lastPage
        ) : "No Rows"
      ),
      React.createElement(Button, {
        style: { marginLeft: 5 },
        disabled: !forwardEnabled || disabled,
        icon: "chevron-right",
        minimal: true,
        className: "paging-arrow-right",
        onClick: this.pageForward
      })
    );
  };

  return PagingTool;
}(React.Component), _class.defaultProps = {
  onPageChange: noop
}, _temp2);

var ConnectedPagingTool = compose(withProps(function (props) {
  var entityCount = props.entityCount,
      page = props.page,
      pageSize = props.pageSize,
      disabled = props.disabled,
      onRefresh = props.onRefresh,
      setPage = props.setPage,
      setPageSize = props.setPageSize;

  return {
    paging: {
      total: entityCount,
      page: page,
      pageSize: pageSize
    },
    disabled: disabled,
    onRefresh: onRefresh,
    setPage: setPage,
    setPageSize: setPageSize
  };
}), withHandlers({
  onPageChange: function onPageChange(_ref) {
    var entities = _ref.entities,
        reduxFormSelectedEntityIdMap = _ref.reduxFormSelectedEntityIdMap;
    return function () {
      var record = get(entities, "[0]");
      if (!record || !record.id && record.id !== 0 && !record.code) {
        reduxFormSelectedEntityIdMap.input.onChange({});
      }
    };
  }
}))(PagingTool);

export default ConnectedPagingTool;