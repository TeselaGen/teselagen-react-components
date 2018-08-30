"use strict";

exports.__esModule = true;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _core = require("@blueprintjs/core");

var _lodash = require("lodash");

var _pluralize = require("pluralize");

var _pluralize2 = _interopRequireDefault(_pluralize);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactApollo = require("react-apollo");

var _reactRedux = require("react-redux");

var _recompose = require("recompose");

var _reduxForm = require("redux-form");

var _DataTable = require("../DataTable");

var _DataTable2 = _interopRequireDefault(_DataTable);

var _withTableParams = require("../DataTable/utils/withTableParams");

var _withTableParams2 = _interopRequireDefault(_withTableParams);

var _withDialog = require("../enhancers/withDialog");

var _withDialog2 = _interopRequireDefault(_withDialog);

var _withField = require("../enhancers/withField");

var _withField2 = _interopRequireDefault(_withField);

var _withQuery = require("../enhancers/withQuery");

var _withQuery2 = _interopRequireDefault(_withQuery);

var _adHoc = require("../utils/adHoc");

var _adHoc2 = _interopRequireDefault(_adHoc);

var _DialogFooter = require("../DialogFooter");

var _DialogFooter2 = _interopRequireDefault(_DialogFooter);

var _BlueprintError = require("../BlueprintError");

var _BlueprintError2 = _interopRequireDefault(_BlueprintError);

var _generateQuery = require("../utils/generateQuery");

var _generateQuery2 = _interopRequireDefault(_generateQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function preventBubble(e) {
  e.stopPropagation();
}
//

exports.default = function (_ref) {
  var _class, _temp2;

  var modelNameToReadableName = _ref.modelNameToReadableName,
      withQueryAsFn = _ref.withQueryAsFn;

  return (0, _reactApollo.compose)(
  // useage example:
  // <GenericSelect {...{
  //   name: "selectedWorklists", //the field name within the redux form Field
  //   isMultiSelect: true,
  //   schema: ["name", "lastModified"],
  //   fragment: worklistMinimalFragment,
  //   additionalDataFragment: worklistFragment,
  // }}/>

  //options:
  // name - the field name of the redux form Field!
  // schema - the schema for the data table
  // getButtonText(selectedEntities) - function to override the button text if necessary
  // isMultiSelect=false - do you want users to be able to select multiple entities or just one
  // noDialog=false - set to true to not have the selector show up in a dialog
  // noRemoveButton=false - set to true to not have the option to remove the selection
  // fragment - the fragment powering the lookup/datatable
  // dialogProps - any dialog overrides you might want to make
  // additionalDataFragment - optional fragment for fetching more data based on the initially selected data
  // postSelectDTProps - props passed to the DataTable shown after select. If none are passed the DataTable isn't shown
  // onSelect - optional callback for doing things with the selected data
  (0, _recompose.branch)(function (props) {
    return props.noForm;
  }, (0, _reduxForm.reduxForm)({
    form: "genericSelect",
    asyncBlurFields: [] //hacky fix for weird redux form asyncValidate error https://github.com/erikras/redux-form/issues/1675
  })), (0, _recompose.withProps)(function (_ref2) {
    var name = _ref2.name;
    return { passedName: name };
  }), (0, _recompose.withProps)(function (_ref3) {
    var fragment = _ref3.fragment,
        nameOverride = _ref3.nameOverride,
        isMultiSelect = _ref3.isMultiSelect,
        schema = _ref3.schema,
        dialogProps = _ref3.dialogProps,
        passedName = _ref3.passedName;

    var modelName = Array.isArray(fragment) ? fragment[0] : (0, _lodash.get)(fragment, "definitions[0].typeCondition.name.value");
    var readableName = nameOverride || modelNameToReadableName(modelName, {
      plural: isMultiSelect,
      upperCase: true
    });
    return {
      readableName: readableName,
      modelName: modelName,
      postSelectFormName: passedName + "PostSelect",
      schema: !schema.model ? {
        model: modelName,
        fields: schema
      } : schema,
      dialogProps: _extends({
        title: "Select " + readableName
      }, dialogProps)
    };
  }), (0, _withField2.default)(), (0, _reactRedux.connect)(null, function (dispatch) {
    return {
      changeFieldValue: function changeFieldValue() {
        return dispatch(_reduxForm.change.apply(undefined, arguments));
      },
      clearFields: function clearFields() {
        return dispatch(_reduxForm.clearFields.apply(undefined, arguments));
      }
    };
  }))((_temp2 = _class = function (_React$Component) {
    _inherits(GenericSelectOuter, _React$Component);

    function GenericSelectOuter() {
      var _this2 = this;

      var _temp, _this, _ret;

      _classCallCheck(this, GenericSelectOuter);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
        fetchingData: false,
        tempValue: null
      }, _this.resetPostSelectSelection = function () {
        var _this$props = _this.props,
            postSelectFormName = _this$props.postSelectFormName,
            _this$props$postSelec = _this$props.postSelectDTProps,
            postSelectDTProps = _this$props$postSelec === undefined ? {} : _this$props$postSelec,
            changeFieldValue = _this$props.changeFieldValue;

        var postSelectDTFormName = postSelectDTProps.formName || postSelectFormName;
        if (postSelectDTFormName) {
          changeFieldValue(postSelectDTFormName, "reduxFormSelectedEntityIdMap", {});
        }
      }, _this.removeSelection = function () {
        var _this$props2 = _this.props,
            form = _this$props2.meta.form,
            name = _this$props2.input.name,
            clearFields = _this$props2.clearFields,
            _this$props2$onClear = _this$props2.onClear,
            onClear = _this$props2$onClear === undefined ? _lodash.noop : _this$props2$onClear;

        clearFields(form, true, true, name);
        onClear();
        _this.setState({
          tempValue: null
        });
        _this.resetPostSelectSelection();
      }, _this.handleOnChange = function (newValue) {
        var _this$props3 = _this.props,
            _this$props3$input = _this$props3.input,
            _this$props3$input$on = _this$props3$input.onChange,
            onChange = _this$props3$input$on === undefined ? _lodash.noop : _this$props3$input$on,
            _this$props3$input$va = _this$props3$input.value,
            value = _this$props3$input$va === undefined ? [] : _this$props3$input$va,
            isMultiSelect = _this$props3.isMultiSelect,
            preserveValue = _this$props3.preserveValue;

        var toSelect = newValue;
        if (isMultiSelect && value.length && preserveValue) {
          var newIds = newValue.map(function (r) {
            return r.id;
          });
          toSelect = value.filter(function (r) {
            return !newIds.includes(r.id);
          }).concat(newValue);
        }
        onChange(toSelect);
      }, _this.handleSelection = function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(records) {
          var _this$props4, additionalDataFragment, readableName, onSelect, isMultiSelect, postSelectDTProps, toSelect, queryFilter, _records, _toSelect;

          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _this$props4 = _this.props, additionalDataFragment = _this$props4.additionalDataFragment, readableName = _this$props4.readableName, onSelect = _this$props4.onSelect, isMultiSelect = _this$props4.isMultiSelect, postSelectDTProps = _this$props4.postSelectDTProps;
                  toSelect = isMultiSelect ? records : records[0];

                  _this.resetPostSelectSelection();

                  if (additionalDataFragment) {
                    _context.next = 7;
                    break;
                  }

                  onSelect && onSelect(toSelect);
                  _this.handleOnChange(toSelect);
                  return _context.abrupt("return");

                case 7:

                  _this.setState({
                    fetchingData: true
                  });
                  queryFilter = {
                    filter: {
                      id: isMultiSelect ? records.map(function (_ref5) {
                        var id = _ref5.id;
                        return id;
                      }) : records[0].id
                    }
                  };

                  if (postSelectDTProps) {
                    _context.next = 25;
                    break;
                  }

                  _context.prev = 10;
                  _context.next = 13;
                  return withQueryAsFn(additionalDataFragment, {
                    isPlural: true
                  })(queryFilter);

                case 13:
                  _records = _context.sent;
                  _toSelect = isMultiSelect ? _records : _records[0];

                  onSelect && onSelect(_toSelect);
                  _this.handleOnChange(_toSelect);
                  _context.next = 23;
                  break;

                case 19:
                  _context.prev = 19;
                  _context.t0 = _context["catch"](10);

                  console.error("err:", _context.t0);
                  window.toastr.error("Error fetching " + readableName);

                case 23:
                  _context.next = 26;
                  break;

                case 25:
                  if (!additionalDataFragment) {
                    _this.handleOnChange(toSelect);
                  } else {
                    // this is necessary because sometimes we are relying on the field to have
                    // the full data
                    _this.setState({
                      tempValue: toSelect
                    });
                  }

                case 26:
                  _this.setState({
                    fetchingData: false
                  });

                case 27:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, _this2, [[10, 19]]);
        }));

        return function (_x) {
          return _ref4.apply(this, arguments);
        };
      }(), _temp), _possibleConstructorReturn(_this, _ret);
    }

    GenericSelectOuter.prototype.render = function render() {
      var _state = this.state,
          fetchingData = _state.fetchingData,
          tempValue = _state.tempValue;
      var _props = this.props,
          value = _props.input.value,
          _props$meta = _props.meta,
          error = _props$meta.error,
          touched = _props$meta.touched,
          readableName = _props.readableName,
          noDialog = _props.noDialog,
          postSelectFormName = _props.postSelectFormName,
          getButtonText = _props.getButtonText,
          noRemoveButton = _props.noRemoveButton,
          getButton = _props.getButton,
          postSelectDTProps = _props.postSelectDTProps,
          withSelectedTitle = _props.withSelectedTitle,
          additionalDataFragment = _props.additionalDataFragment,
          _props$buttonProps = _props.buttonProps,
          buttonProps = _props$buttonProps === undefined ? {} : _props$buttonProps,
          isMultiSelect = _props.isMultiSelect,
          onSelect = _props.onSelect,
          noForm = _props.noForm;

      var postSelectValueToUse = tempValue || value;
      var postSelectDataTableValue = postSelectValueToUse;
      if (postSelectDataTableValue && !Array.isArray(postSelectDataTableValue)) {
        postSelectDataTableValue = [postSelectDataTableValue];
      }
      /* eslint-disable no-debugger*/
      if (postSelectDTProps && !postSelectDTProps.schema) debugger;
      /* eslint-enable no-debugger*/
      var propsToPass = _extends({}, this.props, {
        handleSelection: this.handleSelection
      });
      return noDialog ? _react2.default.createElement(
        "div",
        { onClick: preventBubble },
        _react2.default.createElement(GenericSelectInner, propsToPass),
        _react2.default.createElement(
          "div",
          null,
          touched && error && _react2.default.createElement(_BlueprintError2.default, { error: error })
        )
      ) : _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(
          "div",
          {
            onClick: preventBubble,
            style: { paddingTop: 10, paddingBottom: 10 }
          },
          _react2.default.createElement(
            "div",
            { style: { display: "flex" } },
            _react2.default.createElement(
              GenericSelectInner,
              propsToPass,
              getButton ? getButton(value, propsToPass, this.state) : _react2.default.createElement(_core.Button, _extends({
                intent: value ? _core.Intent.NONE : _core.Intent.PRIMARY,
                text: getButtonText ? getButtonText(value) : value ? "Change " + readableName : "Select " + readableName
              }, buttonProps, {
                loading: fetchingData || buttonProps.loading
              }))
            ),
            value && !noRemoveButton && !noForm && _react2.default.createElement(
              _core.Tooltip,
              {
                disabled: buttonProps.disabled,
                content: "Clear " + readableName
              },
              _react2.default.createElement(_core.Button, {
                minimal: true,
                style: { marginLeft: 4 },
                intent: _core.Intent.DANGER,
                disabled: buttonProps.disabled,
                onClick: this.removeSelection,
                icon: "trash"
              })
            )
          ),
          postSelectDTProps && postSelectDataTableValue && !!postSelectDataTableValue.length && _react2.default.createElement(PostSelectTable, {
            additionalDataFragment: additionalDataFragment,
            initialEntities: postSelectDataTableValue,
            genericSelectValue: value,
            onSelect: onSelect,
            withSelectedTitle: withSelectedTitle,
            readableName: readableName,
            postSelectFormName: postSelectFormName,
            postSelectDTProps: postSelectDTProps,
            isMultiSelect: isMultiSelect,
            resetSelection: this.resetPostSelectSelection,
            changeGenericSelectValue: this.handleOnChange
          })
        ),
        _react2.default.createElement(
          "div",
          null,
          touched && error && _react2.default.createElement(_BlueprintError2.default, { error: error })
        )
      );
    };

    return GenericSelectOuter;
  }(_react2.default.Component), _class.defaultProps = {
    input: {},
    meta: {}
  }, _temp2));
};

var PostSelectTable = (0, _recompose.branch)(function (_ref6) {
  var additionalDataFragment = _ref6.additionalDataFragment;
  return !!additionalDataFragment;
}, function WithQueryHOC(WrappedComponent) {
  return function (_React$Component2) {
    _inherits(WithLoadingComp, _React$Component2);

    function WithLoadingComp() {
      _classCallCheck(this, WithLoadingComp);

      return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
    }

    WithLoadingComp.prototype.render = function render() {
      var _this4 = this;

      var _props2 = this.props,
          additionalDataFragment = _props2.additionalDataFragment,
          isMultiSelect = _props2.isMultiSelect,
          initialEntities = _props2.initialEntities;


      var gqlQuery = (0, _generateQuery2.default)(additionalDataFragment, {
        isPlural: true
      });

      return _react2.default.createElement(
        _reactApollo.Query,
        {
          variables: {
            filter: {
              id: isMultiSelect ? initialEntities.map(function (_ref7) {
                var id = _ref7.id;
                return id;
              }) : initialEntities[0].id
            }
          },
          query: gqlQuery
        },
        function (_ref8) {
          var loading = _ref8.loading,
              error = _ref8.error,
              data = _ref8.data;

          var modelName = Array.isArray(additionalDataFragment) ? additionalDataFragment[0] : (0, _lodash.get)(additionalDataFragment, "definitions[0].typeCondition.name.value");
          var entities = (0, _lodash.get)(data, (0, _pluralize2.default)(modelName) + ".results", []);
          return _react2.default.createElement(WrappedComponent, _extends({}, _this4.props, {
            error: error,
            loading: loading || data.loading,
            entities: entities
          }));
        }
      );
    };

    return WithLoadingComp;
  }(_react2.default.Component);
})(function (_Component) {
  _inherits(PostSelectTableInner, _Component);

  function PostSelectTableInner() {
    _classCallCheck(this, PostSelectTableInner);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  PostSelectTableInner.prototype.componentDidMount = function componentDidMount() {
    this.componentDidMountOrUpdate();
  };

  PostSelectTableInner.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    this.componentDidMountOrUpdate(prevProps);
  };

  PostSelectTableInner.prototype.componentDidMountOrUpdate = function componentDidMountOrUpdate(prevProps) {
    if (!this.props.entities) return;
    var _props3 = this.props,
        isMultiSelect = _props3.isMultiSelect,
        changeGenericSelectValue = _props3.changeGenericSelectValue,
        entities = _props3.entities,
        genericSelectValue = _props3.genericSelectValue,
        _props3$onSelect = _props3.onSelect,
        onSelect = _props3$onSelect === undefined ? _lodash.noop : _props3$onSelect;

    var hasValue = isMultiSelect ? genericSelectValue && genericSelectValue.length : genericSelectValue;
    var prevEntitiesEqual = prevProps && (0, _lodash.isEqual)(prevProps.entities, entities);
    if ((!prevEntitiesEqual || !hasValue) && entities.length) {
      var toSelect = isMultiSelect ? entities : entities[0];
      changeGenericSelectValue(toSelect);
      onSelect(toSelect);
    }
  };

  PostSelectTableInner.prototype.render = function render() {
    var _props4 = this.props,
        initialEntities = _props4.initialEntities,
        withSelectedTitle = _props4.withSelectedTitle,
        readableName = _props4.readableName,
        loading = _props4.loading,
        entities = _props4.entities,
        postSelectFormName = _props4.postSelectFormName,
        postSelectDTProps = _props4.postSelectDTProps;

    return _react2.default.createElement(
      "div",
      { className: "postSelectDataTable", style: { paddingTop: 10 } },
      withSelectedTitle && _react2.default.createElement(
        "h6",
        null,
        "Selected ",
        readableName,
        ":"
      ),
      _react2.default.createElement(_DataTable2.default, _extends({
        formName: postSelectFormName,
        doNotShowEmptyRows: true,
        maxHeight: 400
      }, postSelectDTProps, {
        // destroyOnUnmount={false}
        // keepDirtyOnReinitialize
        // enableReinitialize={true}
        // updateUnregisteredFields
        isLoading: loading,
        entities: entities || initialEntities
      }))
    );
  };

  return PostSelectTableInner;
}(_react.Component));

var GenericSelectInner = (0, _reactApollo.compose)((0, _recompose.branch)(function (_ref9) {
  var noDialog = _ref9.noDialog;
  return !noDialog;
}, (0, _withDialog2.default)({
  enforceFocus: false,
  canOutsideClickClose: false
})), (0, _adHoc2.default)(function (props) {
  var fragment = props.fragment,
      passedName = props.passedName,
      queryOptions = props.queryOptions;

  return [(0, _withTableParams2.default)({
    formName: passedName + "DataTable",
    withSelectedEntities: true
  }), (0, _withQuery2.default)(fragment, { isPlural: true, options: queryOptions })];
}))(function (_Component2) {
  _inherits(GenericSelect, _Component2);

  function GenericSelect() {
    var _temp3, _this6, _ret2;

    _classCallCheck(this, GenericSelect);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp3 = (_this6 = _possibleConstructorReturn(this, _Component2.call.apply(_Component2, [this].concat(args))), _this6), _this6.onDoubleClick = function (record) {
      var _this6$props = _this6.props,
          hideModal = _this6$props.hideModal,
          handleSelection = _this6$props.handleSelection,
          isMultiSelect = _this6$props.isMultiSelect;

      if (isMultiSelect) return;
      hideModal && hideModal();
      handleSelection([record]);
    }, _this6.makeSelection = function () {
      var _this6$props2 = _this6.props,
          hideModal = _this6$props2.hideModal,
          handleSelection = _this6$props2.handleSelection,
          selectedEntities = _this6$props2.selectedEntities;

      handleSelection(selectedEntities);
      hideModal();
    }, _temp3), _possibleConstructorReturn(_this6, _ret2);
  }

  GenericSelect.prototype.render = function render() {
    var _props5 = this.props,
        tableParams = _props5.tableParams,
        hideModal = _props5.hideModal,
        selectedEntities = _props5.selectedEntities,
        isMultiSelect = _props5.isMultiSelect,
        readableName = _props5.readableName,
        minSelected = _props5.minSelected,
        mustSelect = _props5.mustSelect;

    var disableButton = !selectedEntities.length;
    var minSelectMessage = void 0;
    var mustSelectMessage = void 0;
    if (minSelected && selectedEntities.length < minSelected) {
      minSelectMessage = "Please select at least " + minSelected + " " + (0, _pluralize2.default)(readableName);
      disableButton = true;
    }
    if (mustSelect && selectedEntities.length !== mustSelect) {
      mustSelectMessage = "Please select " + mustSelect + " " + (0, _pluralize2.default)(readableName);
      disableButton = true;
    }
    return _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(
        "div",
        { style: { marginBottom: 10 } },
        minSelectMessage,
        mustSelectMessage
      ),
      _react2.default.createElement(_DataTable2.default, _extends({
        withSearch: true,
        withPaging: true,
        doNotShowEmptyRows: true,
        onDoubleClick: this.onDoubleClick,
        withCheckboxes: isMultiSelect,
        isSingleSelect: !isMultiSelect,
        maxHeight: 400
      }, tableParams)),
      _react2.default.createElement(_DialogFooter2.default, {
        hideModal: hideModal,
        disabled: disableButton,
        onClick: this.makeSelection,
        text: "Select " + (selectedEntities.length > 1 ? (0, _pluralize2.default)(readableName) : readableName)
      })
    );
  };

  return GenericSelect;
}(_react.Component));
module.exports = exports["default"];