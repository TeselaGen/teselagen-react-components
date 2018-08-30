"use strict";

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _lodash = require("lodash");

var _core = require("@blueprintjs/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DisplayOptions = function (_React$Component) {
  _inherits(DisplayOptions, _React$Component);

  function DisplayOptions() {
    var _temp, _this, _ret;

    _classCallCheck(this, DisplayOptions);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      isOpen: false,
      searchTerms: {}
    }, _this.openPopover = function () {
      _this.setState({
        isOpen: true
      });
    }, _this.closePopover = function () {
      _this.setState({
        isOpen: false
      });
    }, _this.changeTableDensity = function (e) {
      var _this$props$updateTab = _this.props.updateTableDisplayDensity,
          updateTableDisplayDensity = _this$props$updateTab === undefined ? _lodash.noop : _this$props$updateTab;

      updateTableDisplayDensity(e.target.value);
      _this.closePopover();
    }, _this.toggleForcedHidden = function (e) {
      return _this.props.setShowForcedHidden(e.target.checked);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  DisplayOptions.prototype.render = function render() {
    var _this2 = this;

    var _state = this.state,
        isOpen = _state.isOpen,
        searchTerms = _state.searchTerms;
    var _props = this.props,
        schema = _props.schema,
        _props$updateColumnVi = _props.updateColumnVisibility,
        updateColumnVisibility = _props$updateColumnVi === undefined ? _lodash.noop : _props$updateColumnVi,
        _props$resetDefaultVi = _props.resetDefaultVisibility,
        resetDefaultVisibility = _props$resetDefaultVi === undefined ? _lodash.noop : _props$resetDefaultVi,
        userSpecifiedCompact = _props.userSpecifiedCompact,
        disabled = _props.disabled,
        hasOptionForForcedHidden = _props.hasOptionForForcedHidden,
        showForcedHiddenColumns = _props.showForcedHiddenColumns,
        hideDisplayOptionsIcon = _props.hideDisplayOptionsIcon;

    if (hideDisplayOptionsIcon) {
      return null; //don't show antyhing!
    }
    var fields = schema.fields;

    var fieldGroups = {};
    var mainFields = [];

    fields.forEach(function (field) {
      if (!field.fieldGroup) return mainFields.push(field);
      if (!fieldGroups[field.fieldGroup]) fieldGroups[field.fieldGroup] = [];
      fieldGroups[field.fieldGroup].push(field);
    });

    var numVisible = 0;

    var getFieldCheckbox = function getFieldCheckbox(field, i) {
      var displayName = field.displayName,
          isHidden = field.isHidden,
          isForcedHidden = field.isForcedHidden,
          path = field.path;

      if (!isHidden) numVisible++;
      if (isForcedHidden) return;
      return _react2.default.createElement(_core.Checkbox, {
        key: path || i,
        onChange: function onChange() {
          if (numVisible <= 1 && !isHidden) {
            return window.toastr.warning("We have to display at least one column :)");
          }
          updateColumnVisibility({ shouldShow: isHidden, path: path });
        },
        checked: !isHidden,
        label: displayName
      });
    };

    var fieldGroupMenu = void 0;
    if (!(0, _lodash.isEmpty)(fieldGroups)) {
      fieldGroupMenu = (0, _lodash.map)(fieldGroups, function (groupFields, groupName) {
        var searchTerm = searchTerms[groupName] || "";
        var anyVisible = groupFields.some(function (field) {
          return !field.isHidden && !field.isForcedHidden;
        });
        var anyNotForcedHidden = groupFields.some(function (field) {
          return !field.isForcedHidden;
        });
        if (!anyNotForcedHidden) return;
        return _react2.default.createElement(
          _core.MenuItem,
          { key: groupName, text: groupName },
          _react2.default.createElement(_core.InputGroup, {
            leftIcon: "search",
            value: searchTerm,
            onChange: function onChange(e) {
              var _extends2;

              _this2.setState({
                searchTerms: _extends({}, searchTerms, (_extends2 = {}, _extends2[groupName] = e.target.value, _extends2))
              });
            }
          }),
          _react2.default.createElement(_core.Button, {
            className: _core.Classes.MINIMAL,
            text: (anyVisible ? "Hide" : "Show") + " All",
            style: { margin: "10px 0" },
            onClick: function onClick() {
              updateColumnVisibility({
                shouldShow: !anyVisible,
                paths: groupFields.map(function (field) {
                  return field.path;
                })
              });
            }
          }),
          groupFields.filter(function (field) {
            return field.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
          }).map(getFieldCheckbox)
        );
      });
    }

    return _react2.default.createElement(
      _core.Popover,
      {
        isOpen: isOpen,
        onClose: this.closePopover,
        content: _react2.default.createElement(
          _core.Menu,
          null,
          _react2.default.createElement(
            "div",
            { style: { padding: 10, paddingLeft: 20, paddingRight: 20 } },
            _react2.default.createElement(
              "h5",
              { style: { marginBottom: 10 } },
              "Display Density:"
            ),
            _react2.default.createElement(
              "div",
              { className: _core.Classes.SELECT },
              _react2.default.createElement(
                "select",
                {
                  onChange: this.changeTableDensity,
                  value: userSpecifiedCompact ? "compact" : "normal"
                },
                _react2.default.createElement(
                  "option",
                  { className: _core.Classes.POPOVER_DISMISS, value: "normal" },
                  "Normal"
                ),
                _react2.default.createElement(
                  "option",
                  { className: _core.Classes.POPOVER_DISMISS, value: "compact" },
                  "Compact"
                )
              )
            ),
            _react2.default.createElement(
              "h5",
              { style: { marginBottom: 10, marginTop: 10 } },
              "Displayed Columns:"
            ),
            mainFields.map(getFieldCheckbox),
            fieldGroupMenu,
            hasOptionForForcedHidden && _react2.default.createElement(
              "div",
              { style: { marginTop: 15 } },
              _react2.default.createElement(_core.Switch, {
                label: "Show Empty Columns",
                checked: showForcedHiddenColumns,
                onChange: this.toggleForcedHidden
              })
            ),
            _react2.default.createElement(
              "div",
              {
                style: {
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end"
                }
              },
              _react2.default.createElement(
                _core.Button,
                {
                  onClick: resetDefaultVisibility,
                  title: "Display Options",
                  minimal: true
                },
                "Reset"
              )
            )
          )
        )
      },
      _react2.default.createElement(_core.Button, {
        onClick: this.openPopover,
        disabled: disabled,
        minimal: true,
        icon: "cog"
      })
    );
  };

  return DisplayOptions;
}(_react2.default.Component);

exports.default = DisplayOptions;
module.exports = exports["default"];