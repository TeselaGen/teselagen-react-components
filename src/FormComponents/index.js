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

import { DateInput } from "@blueprintjs/datetime";
import Dropzone from "react-dropzone";

function getIntent({ meta: { touched, error } }) {
  return touched && error ? Intent.DANGER : "";
}

function getIntentClass({ meta: { touched, error } }) {
  return touched && error ? "pt-intent-danger" : "";
}

function removeUnwantedProps(props) {
  let cleanedProps = { ...props };
  delete cleanedProps.className;
  delete cleanedProps.units;
  delete cleanedProps.onChange;
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
      input: { name }
    } = this.props;
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

  componentWillUpdate({
    meta: { dispatch, form },
    defaultValue,
    input: { name }
  }) {
    const { defaultValue: oldDefaultValue } = this.props;
    if (!deepEqual(defaultValue, oldDefaultValue)) {
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
      meta: { touched, error }
    } = this.props;
    const showError = touched && error;

    return (
      <div
        className={`pt-form-group ${getIntentClass(this.props)} ${className}`}
      >
        {label &&
          <label className="pt-label">
            {label}
          </label>}
        <Tooltip
          isDisabled={!tooltipError || !showError}
          intent={Intent.DANGER}
          content={error}
          position={Position.TOP}
          {...tooltipProps}
        >
          {children}
        </Tooltip>
        {!tooltipError &&
          showError &&
          <div className={"tg-field-error-holder pt-form-helper-text"}>
            {error}
          </div>}
      </div>
    );
  }
}

export const renderBlueprintDateInput = props => {
  const { input, intent, ...rest } = props;
  return (
    <DateInput {...removeUnwantedProps(rest)} intent={intent} {...input} />
  );
};

export const renderBlueprintInput = props => {
  const { input, intent, ...rest } = props;
  return (
    <InputGroup {...removeUnwantedProps(rest)} intent={intent} {...input} />
  );
};

export const renderBlueprintCheckbox = props => {
  const { input, label, ...rest } = props;
  return <Checkbox {...removeUnwantedProps(rest)} {...input} label={label} />;
};

export const renderBlueprintFileUpload = props => {
  const {
    input: { onChange, value: files },
    dropzoneOptions = {},
    name
  } = props;
  return (
    <Dropzone
      onDrop={onChange}
      className="pt-file-upload"
      name={name}
      {...dropzoneOptions}
    >
      <span className="te-file-upload-input pt-file-upload-input">
        {files
          ? Array.isArray(files) &&
            files.map((file, i) => {
              return file.name + (i !== files.length - 1 ? "," : "");
            })
          : "Choose file..."}
      </span>
    </Dropzone>
  );
};

export const renderAntFileUpload = ({
  innerText,
  innerIcon,
  contentOverride,
  className = " ",
  hideDropAfterUpload,
  onUploadFinished,
  fileLimit,
  input: { onChange, value = [] },
  ...rest
}) => {
  return (
    <Dragger
      className={
        className +
        " tg-file-upload " +
        (hideDropAfterUpload && value.length && " tg-hide-drop-target")
      }
      fileList={value}
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
          onUploadFinished(fileList);
        }
        onChange(cloneDeep(fileList));
      }}
      {...rest}
    >
      {contentOverride ||
        <div className={"tg-upload-inner"}>
          {innerIcon || <span className={"pt-icon-upload pt-icon-large"} />}
          {innerText || "Click or drag to upload"}
        </div>}
    </Dragger>
  );
};

export const renderBlueprintTextarea = props => {
  const { input, intentClass, inputClassName, ...rest } = props;
  return (
    <textarea
      {...removeUnwantedProps(rest)}
      className={`${intentClass} ${inputClassName} pt-input pt-fill`}
      {...input}
    />
  );
};

export const renderBlueprintEditableText = props => {
  const { input, ...rest } = props;
  return (
    <EditableText
      {...removeUnwantedProps(rest)}
      {...input}
      onConfirm={function(value) {
        input.onBlur && input.onBlur(value);
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
    ...rest
  } = props;
  const propsToUse = {
    ...removeUnwantedProps(rest),
    options:
      options &&
      options.map(function(opt) {
        if (typeof opt === "string") return { label: opt, value: opt };
        return opt;
      }),
    value,
    onChange: function(valOrVals) {
      onChange(
        Array.isArray(valOrVals)
          ? valOrVals.map(function(val) {
              return val.value;
            })
          : valOrVals.value
      );
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
            : typeof value !== "string" ? JSON.stringify(value) : value
        }
        {...(hideValue ? { value: "" } : {})}
        onChange={function(e) {
          let val = e.target.value;
          try {
            val = JSON.parse(e.target.value);
          } catch (e) {}
          onChange(val);
        }}
      >
        {placeholder &&
          <option value="__placeholder__" disabled hidden>
            {placeholder}
          </option>}
        {options.map(function(opt, index) {
          let label, value;
          if (typeof opt === "string") {
            label = opt;
            value = opt;
          } else if (Array.isArray(opt)) {
            throw new Error(
              "the option coming in should be an object, not an array!"
            );
          } else {
            label = opt.label;
            value = opt.value;
          }
          return (
            <option
              key={index}
              value={typeof value !== "string" ? JSON.stringify(value) : value}
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
  const { input, hideValue, intent, inputClassName, ...rest } = props;
  return (
    <NumericInput
      value={input.value}
      intent={intent}
      {...removeUnwantedProps(rest)}
      {...(hideValue ? { value: "" } : {})}
      className={`pt-fill ${inputClassName}`}
      onValueChange={(numericVal, stringVal) => {
        // needed for redux form to change value
        input.onChange(stringVal);
      }}
      onBlur={function(e) {
        try {
          const num = mathExpressionEvaluator.eval(e.target.value);
          input.onBlur(num);
        } catch (e) {
          input.onBlur("");
        }
      }}
    />
  );
};

export const renderBlueprintRadioGroup = ({ input, options, ...rest }) => {
  return (
    <RadioGroup selectedValue={input.value} {...input}>
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

function generateField(component) {
  const compWithDefaultVal = withAbstractWrapper(component);
  return function FieldMaker({ name, ...rest }) {
    return <Field name={name} component={compWithDefaultVal} {...rest} />;
  };
}

export const withAbstractWrapper = ComponentToWrap => {
  return props => {
    let defaultProps = {
      ...props,
      intent: getIntent(props),
      intentClass: getIntentClass(props)
    };
    return (
      <AbstractInput {...props}>
        <ComponentToWrap {...defaultProps} />
      </AbstractInput>
    );
  };
};

export const InputField = generateField(renderBlueprintInput);
export const FileUploadField = generateField(renderBlueprintFileUpload);
export const AntFileUploadField = generateField(renderAntFileUpload);
export const DateInputField = generateField(renderBlueprintDateInput);
export const CheckboxField = generateField(renderBlueprintCheckbox);
export const TextareaField = generateField(renderBlueprintTextarea);
export const EditableTextField = generateField(renderBlueprintEditableText);
export const NumericInputField = generateField(renderBlueprintNumericInput);
export const RadioGroupField = generateField(renderBlueprintRadioGroup);
export const ReactSelectField = generateField(renderReactSelect);
export const SelectField = generateField(renderSelect);
