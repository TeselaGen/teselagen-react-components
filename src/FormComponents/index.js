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
import {
  InputGroup,
  NumericInput,
  Intent,
  Radio,
  RadioGroup,
  Checkbox,
  EditableText,
  Tooltip,
  Position,
  Switch
} from "@blueprintjs/core";

import { DateInput, DateRangeInput } from "@blueprintjs/datetime";

function getIntent({ showErrorIfUntouched, meta: { touched, error } }) {
  return (touched || showErrorIfUntouched) && error ? Intent.DANGER : undefined;
}

function getIntentClass({ showErrorIfUntouched, meta: { touched, error } }) {
  return (touched || showErrorIfUntouched) && error ? "pt-intent-danger" : "";
}

function removeUnwantedProps(props) {
  let cleanedProps = { ...props };
  delete cleanedProps.className;
  delete cleanedProps.units;
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

class AbstractInput extends React.Component {
  componentWillMount() {
    const {
      meta: { dispatch, form },
      defaultValue,
      enableReinitialize,
      input: { name, value }
    } = this.props;
    ((value !== false && !value) || enableReinitialize) &&
      defaultValue !== undefined &&
      dispatch({
        type: "@@redux-form/CHANGE",
        meta: {
          form,
          field: name
        },
        payload: defaultValue
      });
  }

  componentWillReceiveProps({
    meta: { dispatch, form },
    defaultValue,
    input: { name, value }
  }) {
    const { defaultValue: oldDefaultValue, enableReinitialize } = this.props;
    if (
      ((value !== false && !value) || enableReinitialize) &&
      !deepEqual(defaultValue, oldDefaultValue)
    ) {
      dispatch({
        type: "@@redux-form/CHANGE",
        meta: {
          form,
          field: name
        },
        payload: defaultValue
      });
    }
  }

  render() {
    const {
      children,
      tooltipProps,
      tooltipError,
      label,
      inlineLabel,
      secondaryLabel,
      className,
      showErrorIfUntouched,
      meta,
      noOuterLabel
    } = this.props;
    const { touched, error } = meta;
    const showError = (touched || showErrorIfUntouched) && error;

    const componentToWrap = tooltipError ? (
      <Tooltip
        disabled={!showError}
        intent={Intent.DANGER}
        content={error}
        position={Position.TOP}
        {...tooltipProps}
      >
        {children}
      </Tooltip>
    ) : (
      children
    );

    const secondaryLabelComp = secondaryLabel ? (
      <span className="pt-text-muted"> {secondaryLabel}</span>
    ) : null;

    return (
      <div
        className={`pt-form-group tg-form-component ${getIntentClass(
          this.props
        ) || ""} ${className || ""}  ${inlineLabel ? "tg-inlineLabel" : ""}`}
      >
        {label &&
          !noOuterLabel && (
            <label className="pt-label">
              {label}
              {secondaryLabelComp}
            </label>
          )}
        <div>
          {componentToWrap}
          {!tooltipError &&
            showError && (
              <div className={"tg-field-error-holder pt-form-helper-text"}>
                {error}
              </div>
            )}
        </div>
      </div>
    );
  }
}

export const renderBlueprintDateInput = props => {
  const { input, intent, onFieldSubmit, ...rest } = props;
  return (
    <DateInput
      {...getMomentFormatter("MM/DD/YYYY")}
      {...removeUnwantedProps(rest)}
      intent={intent}
      inputProps={{ ...input }}
      {...input}
      value={input.value ? new Date(input.value) : undefined}
      onChange={function(selectedDate) {
        input.onChange(selectedDate);
        onFieldSubmit(selectedDate);
      }}
    />
  );
};

export const renderBlueprintDateRangeInput = props => {
  const { input, intent, onFieldSubmit, ...rest } = props;

  return (
    <DateRangeInput
      {...getMomentFormatter("MM/DD/YYYY")}
      {...removeUnwantedProps(rest)}
      intent={intent}
      inputProps={{ ...input }}
      {...input}
      value={
        input.value
          ? [new Date(input.value[0]), new Date(input.value[1])]
          : undefined
      }
      onChange={function(selectedDate) {
        input.onChange(selectedDate);
        onFieldSubmit(selectedDate);
      }}
    />
  );
};

export const renderBlueprintInput = props => {
  const { input, intent, onFieldSubmit, onKeyDown = noop, ...rest } = props;
  return (
    <InputGroup
      {...removeUnwantedProps(rest)}
      intent={intent}
      {...input}
      onKeyDown={function(...args) {
        onKeyDown(...args);
        const e = args[0];
        if (e.key === "Enter") {
          onFieldSubmit(e.target.value, { enter: true }, e);
        }
      }}
      onBlur={function(e, val) {
        input.onBlur(e, val);
        onFieldSubmit(e.target ? e.target.value : val, { blur: true }, e);
      }}
    />
  );
};

export const renderBlueprintCheckbox = props => {
  const { input, label, onFieldSubmit, ...rest } = props;
  return (
    <Checkbox
      {...removeUnwantedProps(rest)}
      {...input}
      checked={input.value}
      label={label}
      onChange={function(e, val) {
        input.onChange(e, val);
        let valToUse = val;
        if (e.target) {
          valToUse = e.target.value !== "false";
        }
        onFieldSubmit(valToUse);
      }}
    />
  );
};

export const renderBlueprintSwitch = props => {
  const { input, label, onFieldSubmit, ...rest } = props;
  return (
    <Switch
      {...removeUnwantedProps(rest)}
      {...input}
      checked={input.value}
      label={label}
      onChange={function(e, val) {
        input.onChange(e, val);
        onFieldSubmit(e.target ? e.target.value : val);
      }}
    />
  );
};

export const renderFileUpload = props => {
  const { input, onFieldSubmit, ...rest } = props;
  return (
    <Uploader
      fileList={input.value}
      onFieldSubmit={onFieldSubmit}
      {...rest}
      onChange={input.onChange}
    />
  );
};

export const renderBlueprintTextarea = props => {
  const {
    input,
    intentClass,
    inputClassName,
    onFieldSubmit,
    onKeyDown = noop,
    ...rest
  } = props;
  return (
    <textarea
      {...removeUnwantedProps(rest)}
      className={`${intentClass || ""} ${inputClassName ||
        ""} pt-input pt-fill`}
      {...input}
      onBlur={function(e, val) {
        input.onBlur(e, val);
        onFieldSubmit(e.target ? e.target.value : val, { blur: true }, e);
      }}
      onKeyDown={function(...args) {
        const e = args[0];
        onKeyDown(...args);
        if (e.keyCode === 13 && (e.metaKey || e.ctrlKey)) {
          onFieldSubmit(e.target.value, { cmdEnter: true }, e);
        }
      }}
    />
  );
};

// class ClickToEditWrapper extends React.Component {
//   state = { isEditing: false };
//   render() {
//     return <div />;
//   }
// }

export const renderBlueprintEditableText = props => {
  const { input, onFieldSubmit, ...rest } = props;
  return (
    <EditableText
      {...removeUnwantedProps(rest)}
      {...input}
      onConfirm={function(value) {
        input.onBlur && input.onBlur(value);
        onFieldSubmit(value);
      }}
    />
  );
};

export const renderReactSelect = props => {
  // spreading input not working, grab the values needed instead
  const {
    async,
    input: { value, onChange },
    hideValue,
    options,
    onFieldSubmit,
    ...rest
  } = props;
  const optsToUse =
    options &&
    options.map(function(opt) {
      if (typeof opt === "string") {
        return { label: opt, value: opt };
      } else if (isNumber(opt)) return { label: opt.toString(), value: opt };
      return opt;
    });
  const valueToUse = //here we're coercing json values into an object with {label,value} because react-select does not seem to recognize the json value directly
    !Array.isArray(value) && typeof value === "object"
      ? optsToUse.find(obj => {
          return deepEqual(obj.value, value);
        })
      : Array.isArray(value)
        ? value.map(val => {
            return optsToUse
              ? optsToUse.find(obj => {
                  return deepEqual(obj.value, val);
                })
              : val;
          })
        : value;

  const propsToUse = {
    ...removeUnwantedProps(rest),
    options: optsToUse,
    value: valueToUse,
    closeOnSelect: !rest.multi,
    onChange(valOrVals, ...rest2) {
      const valToPass = Array.isArray(valOrVals)
        ? valOrVals.map(function(val) {
            return val.value;
          })
        : valOrVals ? valOrVals.value : "";
      onChange(valToPass, ...rest2);
      if (!rest.submitOnBlur) onFieldSubmit(valToPass);
    },
    onBlur() {
      const valToPass = Array.isArray(valueToUse)
        ? valueToUse.filter(val => !!val).map(function(val) {
            return val.value;
          })
        : valueToUse;
      if (rest.submitOnBlur) {
        onFieldSubmit(valToPass);
      }
    }
  };
  return async ? <Select.Async {...propsToUse} /> : <Select {...propsToUse} />;
};

export const renderSelect = props => {
  // spreading input not working, grab the values needed instead
  const {
    input: { value, onChange },
    hideValue,
    placeholder,
    onFieldSubmit,
    options,
    ...rest
  } = props;
  return (
    <div className={"pt-select pt-fill"}>
      <select
        {...removeUnwantedProps(rest)}
        value={
          placeholder && value === ""
            ? "__placeholder__"
            : typeof value !== "string"
              ? sortify(value) //deterministically sort and stringify the object/number coming in because select fields only support string values
              : value
        }
        {...(hideValue ? { value: "" } : {})}
        onChange={function(e) {
          let val = e.target.value;
          try {
            val = JSON.parse(e.target.value); //try to json parse the string coming in
          } catch (e) {
            //empty
          }
          onChange(val);
          onFieldSubmit(val);
        }}
      >
        {placeholder && (
          <option value="__placeholder__" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map(function(opt, index) {
          let label, value;
          if (typeof opt === "string") {
            //support passing opts like: ['asdf','awfw']
            label = opt;
            value = opt;
          } else if (isNumber(opt)) {
            //support passing opts like: [1,2,3,4]
            label = opt.toString();
            value = opt;
          } else if (Array.isArray(opt)) {
            throw new Error(
              "the option coming in should be an object, not an array!"
            );
          } else {
            //support passing opts the normal way [{label: 'opt1', value: 'hey'}]
            label = opt.label;
            value = opt.value;
          }
          return (
            <option
              key={index}
              value={
                typeof value !== "string"
                  ? sortify(value) //deterministically sort and stringify the object/number coming in because select fields only support string values
                  : value
              }
            >
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export const renderBlueprintNumericInput = props => {
  const {
    input,
    hideValue,
    intent,
    inputClassName,
    onFieldSubmit,
    ...rest
  } = props;
  function handleBlurOrButtonClick(stringVal) {
    try {
      const num = mathExpressionEvaluator.eval(stringVal);
      input.onBlur(num);
      onFieldSubmit(num);
    } catch (e) {
      input.onBlur("");
      onFieldSubmit("");
    }
  }
  return (
    <NumericInput
      value={input.value}
      intent={intent}
      {...removeUnwantedProps(rest)}
      {...(hideValue ? { value: "" } : {})}
      className={`pt-fill ${inputClassName || ""}`}
      onValueChange={(numericVal, stringVal) => {
        // needed for redux form to change value
        input.onChange(stringVal);
      }}
      onButtonClick={function(numericVal, stringVal) {
        handleBlurOrButtonClick(stringVal);
      }}
      onBlur={function(e) {
        handleBlurOrButtonClick(e.target.value);
      }}
    />
  );
};

export const renderBlueprintRadioGroup = ({
  input,
  options,
  onFieldSubmit,
  ...rest
}) => {
  return (
    <RadioGroup
      {...input}
      {...removeUnwantedProps(rest)}
      selectedValue={input.value}
      label={undefined} //removing label from radio group because our label already handles it
      onChange={function(e, val, ...args) {
        input.onChange(e, val, ...args);
        onFieldSubmit(e.target ? e.target.value : val);
      }}
    >
      {options.map(function({ label, value }, index) {
        return <Radio key={index} value={value} label={label} />;
      })}
    </RadioGroup>
  );
};

function generateField(component, opts) {
  const compWithDefaultVal = withAbstractWrapper(component, opts);
  return function FieldMaker({ name, onFieldSubmit = noop, ...rest }) {
    // function onFieldSubmit(e,val) {
    //   _onFieldSubmit && _onFieldSubmit(e.target ? e.target.value : val)
    // }
    return (
      <Field
        onFieldSubmit={onFieldSubmit}
        name={name}
        component={compWithDefaultVal}
        {...rest}
      />
    );
  };
}

export const withAbstractWrapper = (ComponentToWrap, opts = {}) => {
  return props => {
    let defaultProps = {
      ...props,
      intent: getIntent(props),
      intentClass: getIntentClass(props)
    };
    return (
      <AbstractInput {...{ ...opts, ...props }}>
        <ComponentToWrap {...defaultProps} />
      </AbstractInput>
    );
  };
};

export const InputField = generateField(renderBlueprintInput);
export const FileUploadField = generateField(renderFileUpload);
export const DateInputField = generateField(renderBlueprintDateInput);
export const DateRangeInputField = generateField(renderBlueprintDateRangeInput);
export const CheckboxField = generateField(renderBlueprintCheckbox, {
  noOuterLabel: true
});
export const SwitchField = generateField(renderBlueprintSwitch, {
  noOuterLabel: true
});
export const TextareaField = generateField(renderBlueprintTextarea);
export const EditableTextField = generateField(renderBlueprintEditableText);
export const NumericInputField = generateField(renderBlueprintNumericInput);
export const RadioGroupField = generateField(renderBlueprintRadioGroup);
export const ReactSelectField = generateField(renderReactSelect);
export const SelectField = generateField(renderSelect);
