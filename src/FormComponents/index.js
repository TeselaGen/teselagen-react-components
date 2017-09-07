import sortify from "./sortify"; //tnr TODO: export this from json.sortify when https://github.com/ThomasR/JSON.sortify/issues/11 is resolved
import isNumber from "lodash/isNumber";
import mathExpressionEvaluator from "math-expression-evaluator";
import Dragger from "antd/lib/upload/Dragger";
import cloneDeep from "lodash/cloneDeep";
import deepEqual from "deep-equal";
import React from "react";
import { Field } from "redux-form";
import Select from "react-select";
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
  Position
} from "@blueprintjs/core";

import { DateInput, DateRangeInput } from "@blueprintjs/datetime";

function getIntent({ showErrorIfUntouched, meta: { touched, error } }) {
  return (touched || showErrorIfUntouched) && error ? Intent.DANGER : "";
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
  delete cleanedProps.tabIndex;
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
      input: { name, value }
    } = this.props;
    !value &&
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
    const { defaultValue: oldDefaultValue } = this.props;
    if (!value && !deepEqual(defaultValue, oldDefaultValue)) {
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
      className,
      showErrorIfUntouched,
      meta,
      noOuterLabel
    } = this.props;
    const { touched, error } = meta;
    const showError = (touched || showErrorIfUntouched) && error;

    const componentToWrap = tooltipError ? (
      <Tooltip
        isDisabled={!showError}
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

    return (
      <div
        className={`pt-form-group tg-form-component ${getIntentClass(
          this.props
        ) || ""} ${className || ""}`}
      >
        {label && !noOuterLabel && <label className="pt-label">{label}</label>}
        {componentToWrap}
        {!tooltipError &&
        showError && (
          <div className={"tg-field-error-holder pt-form-helper-text"}>
            {error}
          </div>
        )}
      </div>
    );
  }
}

export const renderBlueprintDateInput = props => {
  const { input, intent, onFieldSubmit, ...rest } = props;
  return (
    <DateInput
      {...removeUnwantedProps(rest)}
      intent={intent}
      format="MM/DD/YYYY"
      {...input}
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
      {...removeUnwantedProps(rest)}
      intent={intent}
      format="MM/DD/YYYY"
      {...input}
      onChange={function(selectedDate) {
        input.onChange(selectedDate);
        onFieldSubmit(selectedDate);
      }}
    />
  );
};

export const renderBlueprintInput = props => {
  const { input, intent, onFieldSubmit, ...rest } = props;
  return (
    <InputGroup
      {...removeUnwantedProps(rest)}
      intent={intent}
      {...input}
      onKeyDown={function(e) {
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
        onFieldSubmit(e.target ? e.target.value : val);
      }}
    />
  );
};

export const renderAntFileUpload = ({
  innerText,
  innerIcon,
  contentOverride,
  className = " ",
  hideDropAfterUpload,
  fileLimit,
  onFieldSubmit,
  accept,
  input: { onChange, value = [] },
  ...rest
}) => {
  let acceptToUse = Array.isArray(accept) ? accept.join(", ") : accept;

  return (
    <div
      title={
        acceptToUse ? (
          "Accepts only the following file types: " + acceptToUse
        ) : (
          "Accepts any file input"
        )
      }
    >
      <Dragger
        className={
          className +
          " tg-file-upload " +
          (hideDropAfterUpload && value.length ? " tg-hide-drop-target" : "")
        }
        fileList={value}
        accept={acceptToUse}
        onChange={function(info) {
          let fileList = info.fileList;
          // 1. Limit the number of uploaded files to the fileLimit if it exists
          if (fileLimit) {
            fileList = fileList.slice(-fileLimit);
          }
          if (
            !fileList.some(file => {
              return file.status === "uploading";
            })
          ) {
            onFieldSubmit(fileList);
          }
          onChange(cloneDeep(fileList));
        }}
        {...rest}
      >
        {contentOverride || (
          <div className={"tg-upload-inner"}>
            {innerIcon || <span className={"pt-icon-upload pt-icon-large"} />}
            {innerText || "Click or drag to upload"}
          </div>
        )}
      </Dragger>
    </div>
  );
};

export const renderBlueprintTextarea = props => {
  const { input, intentClass, inputClassName, onFieldSubmit, ...rest } = props;
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
      onKeyDown={function(e) {
        if (e.keyCode === 13 && (e.metaKey || e.ctrlKey)) {
          onFieldSubmit(e.target.value, { cmdEnter: true }, e);
        }
      }}
    />
  );
};

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

    onChange(valOrVals, ...rest) {
      const valToPass = Array.isArray(valOrVals)
        ? valOrVals.map(function(val) {
            return val.value;
          })
        : valOrVals ? valOrVals.value : "";
      onChange(valToPass, ...rest);
      onFieldSubmit(valToPass);
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
          placeholder && value === "" ? (
            "__placeholder__"
          ) : typeof value !== "string" ? (
            sortify(value) //deterministically sort and stringify the object/number coming in because select fields only support string values
          ) : (
            value
          )
        }
        {...(hideValue ? { value: "" } : {})}
        onChange={function(e) {
          let val = e.target.value;
          try {
            val = JSON.parse(e.target.value); //try to json parse the string coming in
          } catch (e) {}
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
                typeof value !== "string" ? (
                  sortify(value) //deterministically sort and stringify the object/number coming in because select fields only support string values
                ) : (
                  value
                )
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
      selectedValue={input.value}
      onChange={function(e, val, ...args) {
        input.onChange(e, val, ...args);
        onFieldSubmit(e.target ? e.target.value : val);
      }}
    >
      {options.map(function({ label, value }, index) {
        return (
          <Radio
            {...removeUnwantedProps(rest)}
            key={index}
            value={value}
            label={label}
          />
        );
      })}
    </RadioGroup>
  );
};

function generateField(component, opts) {
  const compWithDefaultVal = withAbstractWrapper(component, opts);
  return function FieldMaker({ name, onFieldSubmit = () => {}, ...rest }) {
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
export const AntFileUploadField = generateField(renderAntFileUpload);
export const DateInputField = generateField(renderBlueprintDateInput);
export const DateRangeInputField = generateField(renderBlueprintDateRangeInput);
export const CheckboxField = generateField(renderBlueprintCheckbox, {
  noOuterLabel: true
});
export const TextareaField = generateField(renderBlueprintTextarea);
export const EditableTextField = generateField(renderBlueprintEditableText);
export const NumericInputField = generateField(renderBlueprintNumericInput);
export const RadioGroupField = generateField(renderBlueprintRadioGroup);
export const ReactSelectField = generateField(renderReactSelect);
export const SelectField = generateField(renderSelect);
