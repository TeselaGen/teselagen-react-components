var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import classNames from "classnames";
import sortify from "./sortify"; //tnr TODO: export this from json.sortify when https://github.com/ThomasR/JSON.sortify/issues/11 is resolved
import { isNumber, noop } from "lodash";
import mathExpressionEvaluator from "math-expression-evaluator";
import deepEqual from "deep-equal";
import React from "react";
import { Field } from "redux-form";
import Select from "react-select";
import Uploader from "./Uploader";
import getMomentFormatter from "../utils/getMomentFormatter";

import "./style.css";
import { InputGroup, NumericInput, Intent, Radio, RadioGroup, Checkbox, EditableText, Tooltip, Position, Switch, Classes, FormGroup } from "@blueprintjs/core";

import { DateInput, DateRangeInput } from "@blueprintjs/datetime";

function getIntent(_ref) {
  var showErrorIfUntouched = _ref.showErrorIfUntouched,
      _ref$meta = _ref.meta,
      touched = _ref$meta.touched,
      error = _ref$meta.error;

  return (touched || showErrorIfUntouched) && error ? Intent.DANGER : undefined;
}

function getIntentClass(_ref2) {
  var showErrorIfUntouched = _ref2.showErrorIfUntouched,
      _ref2$meta = _ref2.meta,
      touched = _ref2$meta.touched,
      error = _ref2$meta.error;

  return (touched || showErrorIfUntouched) && error ? Classes.INTENT_DANGER : "";
}

function removeUnwantedProps(props) {
  var cleanedProps = _extends({}, props);
  delete cleanedProps.className;
  delete cleanedProps.units;
  delete cleanedProps.inlineLabel;
  delete cleanedProps.showErrorIfUntouched;
  delete cleanedProps.onChange;
  delete cleanedProps.onFieldSubmit;
  delete cleanedProps.onBlur;
  delete cleanedProps.intent;
  delete cleanedProps.intentClass;
  delete cleanedProps.meta;
  delete cleanedProps.defaultValue;
  delete cleanedProps.enableReinitialize;
  delete cleanedProps.tabIndex;
  delete cleanedProps.secondaryLabel;
  delete cleanedProps.tooltipError;
  delete cleanedProps.tooltipProps;
  if (cleanedProps.inputClassName) {
    cleanedProps.className = cleanedProps.inputClassName;
    delete cleanedProps.inputClassName;
  }
  return cleanedProps;
}

var AbstractInput = function (_React$Component) {
  _inherits(AbstractInput, _React$Component);

  function AbstractInput() {
    _classCallCheck(this, AbstractInput);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  AbstractInput.prototype.UNSAFE_componentWillMount = function UNSAFE_componentWillMount() {
    var _props = this.props,
        _props$meta = _props.meta,
        dispatch = _props$meta.dispatch,
        form = _props$meta.form,
        defaultValue = _props.defaultValue,
        enableReinitialize = _props.enableReinitialize,
        _props$input = _props.input,
        name = _props$input.name,
        value = _props$input.value;

    (value !== false && !value || enableReinitialize) && defaultValue !== undefined && dispatch({
      type: "@@redux-form/CHANGE",
      meta: {
        form: form,
        field: name
      },
      payload: defaultValue
    });
  };

  AbstractInput.prototype.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(_ref3) {
    var _ref3$meta = _ref3.meta,
        dispatch = _ref3$meta.dispatch,
        form = _ref3$meta.form,
        defaultValue = _ref3.defaultValue,
        _ref3$input = _ref3.input,
        name = _ref3$input.name,
        value = _ref3$input.value;
    var _props2 = this.props,
        oldDefaultValue = _props2.defaultValue,
        enableReinitialize = _props2.enableReinitialize;

    if ((value !== false && !value || enableReinitialize) && !deepEqual(defaultValue, oldDefaultValue)) {
      dispatch({
        type: "@@redux-form/CHANGE",
        meta: {
          form: form,
          field: name
        },
        payload: defaultValue
      });
    }
  };

  AbstractInput.prototype.render = function render() {
    var _props3 = this.props,
        children = _props3.children,
        tooltipProps = _props3.tooltipProps,
        tooltipError = _props3.tooltipError,
        disabled = _props3.disabled,
        intent = _props3.intent,
        label = _props3.label,
        inlineLabel = _props3.inlineLabel,
        secondaryLabel = _props3.secondaryLabel,
        className = _props3.className,
        showErrorIfUntouched = _props3.showErrorIfUntouched,
        meta = _props3.meta,
        noOuterLabel = _props3.noOuterLabel,
        noFillField = _props3.noFillField;
    var touched = meta.touched,
        error = meta.error;

    var showError = (touched || showErrorIfUntouched) && error;
    var componentToWrap = tooltipError ? React.createElement(
      Tooltip,
      _extends({
        disabled: !showError,
        intent: Intent.DANGER,
        content: error,
        position: Position.TOP
      }, tooltipProps),
      children
    ) : children;
    if (noFillField) {
      componentToWrap = React.createElement(
        "div",
        {
          className: classNames({
            "tg-no-fill-field": noFillField
          })
        },
        componentToWrap
      );
    }
    return React.createElement(
      FormGroup,
      {
        className: classNames(className, {
          "tg-tooltipError": tooltipError
        }),
        disabled: disabled,
        helperText: !tooltipError && showError && error,
        intent: intent,
        label: !noOuterLabel && label,
        inline: inlineLabel,
        labelInfo: secondaryLabel
      },
      componentToWrap
    );
  };

  return AbstractInput;
}(React.Component);

var renderBlueprintDateInput = function renderBlueprintDateInput(props) {
  var input = props.input,
      intent = props.intent,
      onFieldSubmit = props.onFieldSubmit,
      inputProps = props.inputProps,
      rest = _objectWithoutProperties(props, ["input", "intent", "onFieldSubmit", "inputProps"]);

  return React.createElement(DateInput, _extends({}, getMomentFormatter("MM/DD/YYYY"), removeUnwantedProps(rest), {
    intent: intent,
    inputProps: inputProps
  }, input, {
    value: input.value ? new Date(input.value) : undefined,
    onChange: function onChange(selectedDate) {
      input.onChange(selectedDate);
      onFieldSubmit(selectedDate);
    }
  }));
};

export { renderBlueprintDateInput };
var renderBlueprintDateRangeInput = function renderBlueprintDateRangeInput(props) {
  var input = props.input,
      intent = props.intent,
      onFieldSubmit = props.onFieldSubmit,
      inputProps = props.inputProps,
      rest = _objectWithoutProperties(props, ["input", "intent", "onFieldSubmit", "inputProps"]);

  return React.createElement(DateRangeInput, _extends({}, getMomentFormatter("MM/DD/YYYY"), removeUnwantedProps(rest), {
    intent: intent,
    inputProps: inputProps
  }, input, {
    value: input.value ? [new Date(input.value[0]), new Date(input.value[1])] : undefined,
    onChange: function onChange(selectedDate) {
      input.onChange(selectedDate);
      onFieldSubmit(selectedDate);
    }
  }));
};

export { renderBlueprintDateRangeInput };
var renderBlueprintInput = function renderBlueprintInput(props) {
  var input = props.input,
      intent = props.intent,
      onFieldSubmit = props.onFieldSubmit,
      _props$onKeyDown = props.onKeyDown,
      _onKeyDown = _props$onKeyDown === undefined ? noop : _props$onKeyDown,
      rest = _objectWithoutProperties(props, ["input", "intent", "onFieldSubmit", "onKeyDown"]);

  return React.createElement(InputGroup, _extends({}, removeUnwantedProps(rest), {
    intent: intent
  }, input, {
    onKeyDown: function onKeyDown() {
      _onKeyDown.apply(undefined, arguments);
      var e = arguments.length <= 0 ? undefined : arguments[0];
      if (e.key === "Enter") {
        onFieldSubmit(e.target.value, { enter: true }, e);
      }
    },
    onBlur: function onBlur(e, val) {
      if (rest.readOnly) return;
      input.onBlur(e, val);
      onFieldSubmit(e.target ? e.target.value : val, { blur: true }, e);
    }
  }));
};

export { renderBlueprintInput };
var renderBlueprintCheckbox = function renderBlueprintCheckbox(props) {
  var input = props.input,
      label = props.label,
      onFieldSubmit = props.onFieldSubmit,
      rest = _objectWithoutProperties(props, ["input", "label", "onFieldSubmit"]);

  return React.createElement(Checkbox, _extends({}, removeUnwantedProps(rest), input, {
    checked: input.value,
    label: label,
    onChange: function onChange(e, val) {
      input.onChange(e, val);
      var valToUse = val;
      if (e.target) {
        valToUse = e.target.value !== "false";
      }
      onFieldSubmit(valToUse);
    }
  }));
};

export { renderBlueprintCheckbox };
var renderBlueprintSwitch = function renderBlueprintSwitch(props) {
  var input = props.input,
      label = props.label,
      onFieldSubmit = props.onFieldSubmit,
      rest = _objectWithoutProperties(props, ["input", "label", "onFieldSubmit"]);

  return React.createElement(Switch, _extends({}, removeUnwantedProps(rest), input, {
    checked: input.value,
    label: label,
    onChange: function onChange(e, val) {
      input.onChange(e, val);
      onFieldSubmit(e.target ? e.target.value : val);
    }
  }));
};

export { renderBlueprintSwitch };
var renderFileUpload = function renderFileUpload(props) {
  var input = props.input,
      onFieldSubmit = props.onFieldSubmit,
      rest = _objectWithoutProperties(props, ["input", "onFieldSubmit"]);

  return React.createElement(Uploader, _extends({
    fileList: input.value,
    onFieldSubmit: onFieldSubmit
  }, rest, {
    onChange: input.onChange
  }));
};

export { renderFileUpload };
var renderBlueprintTextarea = function renderBlueprintTextarea(props) {
  var input = props.input,
      intentClass = props.intentClass,
      inputClassName = props.inputClassName,
      onFieldSubmit = props.onFieldSubmit,
      _props$onKeyDown2 = props.onKeyDown,
      _onKeyDown2 = _props$onKeyDown2 === undefined ? noop : _props$onKeyDown2,
      rest = _objectWithoutProperties(props, ["input", "intentClass", "inputClassName", "onFieldSubmit", "onKeyDown"]);

  return React.createElement("textarea", _extends({}, removeUnwantedProps(rest), {
    className: classNames(intentClass, inputClassName, Classes.INPUT, Classes.FILL)
  }, input, {
    onBlur: function onBlur(e, val) {
      if (rest.readOnly) return;
      input.onBlur(e, val);
      onFieldSubmit(e.target ? e.target.value : val, { blur: true }, e);
    },
    onKeyDown: function onKeyDown() {
      var e = arguments.length <= 0 ? undefined : arguments[0];
      _onKeyDown2.apply(undefined, arguments);
      if (e.keyCode === 13 && (e.metaKey || e.ctrlKey)) {
        onFieldSubmit(e.target.value, { cmdEnter: true }, e);
      }
    }
  }));
};

// class ClickToEditWrapper extends React.Component {
//   state = { isEditing: false };
//   render() {
//     return <div />;
//   }
// }

export { renderBlueprintTextarea };
var renderBlueprintEditableText = function renderBlueprintEditableText(props) {
  var input = props.input,
      onFieldSubmit = props.onFieldSubmit,
      rest = _objectWithoutProperties(props, ["input", "onFieldSubmit"]);

  return React.createElement(EditableText, _extends({}, removeUnwantedProps(rest), input, {
    onConfirm: function onConfirm(value) {
      input.onBlur && input.onBlur(value);
      onFieldSubmit(value, { input: input, meta: rest.meta });
    }
  }));
};

export { renderBlueprintEditableText };
var renderReactSelect = function renderReactSelect(props) {
  // spreading input not working, grab the values needed instead
  var async = props.async,
      _props$input2 = props.input,
      value = _props$input2.value,
      _onChange = _props$input2.onChange,
      hideValue = props.hideValue,
      options = props.options,
      onFieldSubmit = props.onFieldSubmit,
      rest = _objectWithoutProperties(props, ["async", "input", "hideValue", "options", "onFieldSubmit"]);

  var optsToUse = options && options.map(function (opt) {
    if (typeof opt === "string") {
      return { label: opt, value: opt };
    } else if (isNumber(opt)) return { label: opt.toString(), value: opt };
    return opt;
  });
  var valueToUse = //here we're coercing json values into an object with {label,value} because react-select does not seem to recognize the json value directly
  !Array.isArray(value) && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" ? optsToUse.find(function (obj) {
    return deepEqual(obj.value, value);
  }) : Array.isArray(value) ? value.map(function (val) {
    return optsToUse ? optsToUse.find(function (obj) {
      return deepEqual(obj.value, val);
    }) : val;
  }) : value;

  var propsToUse = _extends({}, removeUnwantedProps(rest), {
    options: optsToUse,
    value: valueToUse,
    closeOnSelect: !rest.multi,
    onChange: function onChange(valOrVals) {
      var valToPass = Array.isArray(valOrVals) ? valOrVals.map(function (val) {
        return val.value;
      }) : valOrVals ? valOrVals.value : "";

      for (var _len = arguments.length, rest2 = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest2[_key - 1] = arguments[_key];
      }

      _onChange.apply(undefined, [valToPass].concat(rest2));
      if (!rest.submitOnBlur) onFieldSubmit(valToPass);
    },
    onBlur: function onBlur() {
      var valToPass = Array.isArray(valueToUse) ? valueToUse.filter(function (val) {
        return !!val;
      }).map(function (val) {
        return val.value;
      }) : valueToUse;
      if (rest.submitOnBlur) {
        onFieldSubmit(valToPass);
      }
    }
  });
  return async ? React.createElement(Select.Async, propsToUse) : React.createElement(Select, propsToUse);
};

export { renderReactSelect };
var BPSelect = function BPSelect(_ref4) {
  var value = _ref4.value,
      onChange = _ref4.onChange,
      rest = _objectWithoutProperties(_ref4, ["value", "onChange"]);

  return renderSelect(_extends({}, rest, { input: { onChange: onChange, value: value } }));
};

export { BPSelect };
var renderSelect = function renderSelect(props) {
  // spreading input not working, grab the values needed instead
  var _props$input3 = props.input,
      value = _props$input3.value,
      _onChange2 = _props$input3.onChange,
      hideValue = props.hideValue,
      className = props.className,
      placeholder = props.placeholder,
      onFieldSubmit = props.onFieldSubmit,
      options = props.options,
      rest = _objectWithoutProperties(props, ["input", "hideValue", "className", "placeholder", "onFieldSubmit", "options"]);

  return React.createElement(
    "div",
    { className: classNames(Classes.SELECT, Classes.FILL, className) },
    React.createElement(
      "select",
      _extends({}, removeUnwantedProps(rest), {
        value: placeholder && value === "" ? "__placeholder__" : typeof value !== "string" ? sortify(value) //deterministically sort and stringify the object/number coming in because select fields only support string values
        : value
      }, hideValue ? { value: "" } : {}, {
        onChange: function onChange(e) {
          var val = e.target.value;
          try {
            val = JSON.parse(e.target.value); //try to json parse the string coming in
          } catch (e) {
            //empty
          }
          _onChange2(val);
          onFieldSubmit && onFieldSubmit(val);
        }
      }),
      placeholder && React.createElement(
        "option",
        { value: "__placeholder__", disabled: true, hidden: true },
        placeholder
      ),
      options.map(function (opt, index) {
        var label = void 0,
            value = void 0;
        if (typeof opt === "string") {
          //support passing opts like: ['asdf','awfw']
          label = opt;
          value = opt;
        } else if (isNumber(opt)) {
          //support passing opts like: [1,2,3,4]
          label = opt.toString();
          value = opt;
        } else if (Array.isArray(opt)) {
          throw new Error("the option coming in should be an object, not an array!");
        } else {
          //support passing opts the normal way [{label: 'opt1', value: 'hey'}]
          label = opt.label;
          value = opt.value;
        }
        return React.createElement(
          "option",
          {
            key: index,
            value: typeof value !== "string" ? sortify(value) //deterministically sort and stringify the object/number coming in because select fields only support string values
            : value
          },
          label
        );
      })
    )
  );
};

export { renderSelect };
var renderBlueprintNumericInput = function renderBlueprintNumericInput(props) {
  var input = props.input,
      hideValue = props.hideValue,
      intent = props.intent,
      inputClassName = props.inputClassName,
      onFieldSubmit = props.onFieldSubmit,
      rest = _objectWithoutProperties(props, ["input", "hideValue", "intent", "inputClassName", "onFieldSubmit"]);

  function handleBlurOrButtonClick(stringVal) {
    if (rest.readOnly) return;
    try {
      var num = mathExpressionEvaluator.eval(stringVal);
      input.onBlur(num);
      onFieldSubmit(num);
    } catch (e) {
      input.onBlur("");
      onFieldSubmit("");
    }
  }
  return React.createElement(NumericInput, _extends({
    value: input.value,
    intent: intent
  }, removeUnwantedProps(rest), hideValue ? { value: "" } : {}, {
    className: classNames(Classes.FILL, inputClassName),
    onValueChange: function onValueChange(numericVal, stringVal) {
      // needed for redux form to change value
      input.onChange(stringVal);
    },
    onButtonClick: function onButtonClick(numericVal, stringVal) {
      handleBlurOrButtonClick(stringVal);
    },
    onBlur: function onBlur(e) {
      handleBlurOrButtonClick(e.target.value);
    }
  }));
};

export { renderBlueprintNumericInput };
var renderBlueprintRadioGroup = function renderBlueprintRadioGroup(_ref5) {
  var input = _ref5.input,
      options = _ref5.options,
      onFieldSubmit = _ref5.onFieldSubmit,
      rest = _objectWithoutProperties(_ref5, ["input", "options", "onFieldSubmit"]);

  return React.createElement(
    RadioGroup,
    _extends({}, input, removeUnwantedProps(rest), {
      selectedValue: input.value,
      label: undefined //removing label from radio group because our label already handles it
      , onChange: function onChange(e, val) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        input.onChange.apply(input, [e, val].concat(args));
        onFieldSubmit(e.target ? e.target.value : val);
      }
    }),
    options.map(function (_ref6, index) {
      var label = _ref6.label,
          value = _ref6.value,
          disabled = _ref6.disabled;

      return React.createElement(Radio, { key: index, value: value, label: label, disabled: disabled });
    })
  );
};

export { renderBlueprintRadioGroup };
function generateField(component, opts) {
  var compWithDefaultVal = withAbstractWrapper(component, opts);
  return function FieldMaker(_ref7) {
    var name = _ref7.name,
        _ref7$onFieldSubmit = _ref7.onFieldSubmit,
        onFieldSubmit = _ref7$onFieldSubmit === undefined ? noop : _ref7$onFieldSubmit,
        rest = _objectWithoutProperties(_ref7, ["name", "onFieldSubmit"]);

    // function onFieldSubmit(e,val) {
    //   _onFieldSubmit && _onFieldSubmit(e.target ? e.target.value : val)
    // }
    return React.createElement(Field, _extends({
      onFieldSubmit: onFieldSubmit,
      name: name,
      component: compWithDefaultVal
    }, rest));
  };
}

export var withAbstractWrapper = function withAbstractWrapper(ComponentToWrap) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return function (props) {
    var defaultProps = _extends({}, props, {
      intent: getIntent(props),
      intentClass: getIntentClass(props)
    });
    return React.createElement(
      AbstractInput,
      _extends({}, opts, defaultProps),
      React.createElement(ComponentToWrap, defaultProps)
    );
  };
};

export var InputField = generateField(renderBlueprintInput);
export var FileUploadField = generateField(renderFileUpload);
export var DateInputField = generateField(renderBlueprintDateInput);
export var DateRangeInputField = generateField(renderBlueprintDateRangeInput);
export var CheckboxField = generateField(renderBlueprintCheckbox, {
  noOuterLabel: true,
  noFillField: true
});
export var SwitchField = generateField(renderBlueprintSwitch, {
  noOuterLabel: true,
  noFillField: true
});
export var TextareaField = generateField(renderBlueprintTextarea);
export var EditableTextField = generateField(renderBlueprintEditableText);
export var NumericInputField = generateField(renderBlueprintNumericInput);
export var RadioGroupField = generateField(renderBlueprintRadioGroup, {
  noFillField: true
});
export var ReactSelectField = generateField(renderReactSelect);
export var SelectField = generateField(renderSelect);