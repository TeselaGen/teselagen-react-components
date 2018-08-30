"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactSortableHoc = require("react-sortable-hoc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function CustomTheadComponent(props) {
  var headerColumns = props.children.props.children;
  return _react2.default.createElement(
    "div",
    { className: "rt-thead " + props.className, style: props.style },
    _react2.default.createElement(
      "div",
      { className: "rt-tr" },
      headerColumns.map(function (column) {
        // if a column is marked as immovable just return regular column
        if (column.props.immovable === "true") return column;
        // keeps track of hidden columns here so columnIndex might not equal i
        return column;
      })
    )
  );
}

var SortableCustomTheadComponent = (0, _reactSortableHoc.SortableContainer)(CustomTheadComponent);

var SortableColumns = function (_Component) {
  _inherits(SortableColumns, _Component);

  function SortableColumns() {
    var _temp, _this, _ret;

    _classCallCheck(this, SortableColumns);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.shouldCancelStart = function (e) {
      var className = e.target.className;
      // if its an svg then it's a blueprint icon
      return e.target instanceof SVGElement || className.indexOf("rt-resizer") > -1;
    }, _this.onSortEnd = function (_ref) {
      var oldIndex = _ref.oldIndex,
          newIndex = _ref.newIndex;

      _this.props.moveColumn({
        oldIndex: oldIndex,
        newIndex: newIndex
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  SortableColumns.prototype.render = function render() {
    return _react2.default.createElement(SortableCustomTheadComponent, _extends({}, this.props, {
      lockAxis: "x",
      axis: "x",
      distance: 10,
      helperClass: "above-dialog",
      shouldCancelStart: this.shouldCancelStart,
      onSortEnd: this.onSortEnd
    }));
  };

  return SortableColumns;
}(_react.Component);

exports.default = SortableColumns;
module.exports = exports["default"];