"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _core = require("@blueprintjs/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// queryParams: {
//   filters: {},
//   sorting: [],
//   paging: {},
//   columns: [],
//   trackingInfo: {},
//   responseId: {}
// }
var PagingToolbar = function (_React$Component) {
  _inherits(PagingToolbar, _React$Component);

  function PagingToolbar() {
    var _temp, _this, _ret;

    _classCallCheck(this, PagingToolbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleValueChange = function (valueAsNumber, valueAsString) {
      console.log("Value as number:", valueAsNumber);
      console.log("Value as string:", valueAsString);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  PagingToolbar.prototype.render = function render() {
    var _props = this.props,
        _props$paging = _props.paging,
        pageSize = _props$paging.pageSize,
        page = _props$paging.page,
        total = _props$paging.total,
        setPageSize = _props.setPageSize,
        setPage = _props.setPage;

    var pageStart = (page - 1) * pageSize + 1;
    var pageEnd = (page - 1) * pageSize + pageSize < total ? (page - 1) * pageSize + pageSize : total;
    var backEnabled = page - 1 > 0;
    var forwardEnabled = page + 1 < (total + pageSize) / pageSize;
    return _react2.default.createElement(
      "div",
      { className: "paging-toolbar-container" },
      _react2.default.createElement(
        "span",
        null,
        " Rows per page: "
      ),
      _react2.default.createElement(_core.NumericInput, {
        className: "paging-row-input",
        value: pageSize,
        onValueChange: function onValueChange(value) {
          setPageSize(value);
        }
      }),
      _react2.default.createElement("span", {
        onClick: function onClick() {
          if (backEnabled) {
            setPage(page - 1);
          } else {
            toastr && toastr.warning("No more pages that way");
          }
        },
        className: "pt-icon-standard pt-icon-arrow-left paging-arrow-left " + (!backEnabled && " pt-disabled")
      }),
      _react2.default.createElement(
        "span",
        null,
        " ",
        pageStart,
        "-",
        pageEnd,
        " of ",
        total,
        " "
      ),
      _react2.default.createElement("span", {
        onClick: function onClick() {
          if (forwardEnabled) {
            setPage(page + 1);
          } else {
            toastr && toastr.warning("No more pages that way");
          }
        },
        className: "pt-icon-standard pt-icon-arrow-right paging-arrow-right " + (!forwardEnabled && " pt-disabled")
      })
    );
  };

  return PagingToolbar;
}(_react2.default.Component);

exports.default = PagingToolbar;
module.exports = exports["default"];