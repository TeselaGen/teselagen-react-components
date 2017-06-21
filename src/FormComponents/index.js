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
          <div className={"pt-form-helper-text"}>{error}</div>}
      </div>
    );
  }
}

export const renderBlueprintDateInput = props => {
  const { input, intent, ...rest } = props;
  return (
    <DateInput intent={intent} {...input} {...removeUnwantedProps(rest)} />
  );
};

export const renderBlueprintInput = props => {
  const { input, intent, ...rest } = props;
  return (
    <InputGroup intent={intent} {...input} {...removeUnwantedProps(rest)} />
  );
};

export const renderBlueprintCheckbox = props => {
  const { input, label, ...rest } = props;
  return <Checkbox {...input} {...removeUnwantedProps(rest)} label={label} />;
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
      {...input}
      onConfirm={function(value) {
        input.onBlur && input.onBlur(value);
      }}
      {...removeUnwantedProps(rest)}
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
    options: options &&
      options.map(function(opt) {
        if (typeof opt === "string") return { label: opt, value: opt };
        return opt;
      }),
    value,
    onChange,
    ...removeUnwantedProps(rest)
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
        {...(hideValue ? { value: "" } : {})}
        value={JSON.stringify(value)}
        onChange={function(e) {
          onChange(JSON.parse(e.target.value));
        }}
        {...removeUnwantedProps(rest)}
      >
        {placeholder &&
          <option value="" disabled selected hidden>
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
            <option key={index} value={JSON.stringify(value)}>
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
      onValueChange={value => {
        // needed for redux form to change value
        rest.onChange ? rest.onChange(value) : input.onChange(value);
      }}
      intent={intent}
      {...(hideValue ? { value: "" } : {})}
      {...input}
      {...removeUnwantedProps(rest)}
      className={`pt-fill ${inputClassName}`}
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
export const DateInputField = generateField(renderBlueprintDateInput);
export const CheckboxField = generateField(renderBlueprintCheckbox);
export const TextareaField = generateField(renderBlueprintTextarea);
export const EditableTextField = generateField(renderBlueprintEditableText);
export const NumericInputField = generateField(renderBlueprintNumericInput);
export const RadioGroupField = generateField(renderBlueprintRadioGroup);
export const ReactSelectField = generateField(renderReactSelect);
export const SelectField = generateField(renderSelect);
