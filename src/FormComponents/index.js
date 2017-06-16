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

function noop() {}

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

function AbstractInput(props) {
  const {
    children,
    tooltipProps,
    tooltipError,
    label,
    className,
    meta: { touched, error }
  } = props;
  const showError = touched && error;

  return (
    <div className={`pt-form-group ${getIntentClass(props)} ${className}`}>
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

const handleFileUpload = e => {
  if (!e.target.files.length) return;
  const file = e.target.files[0];
  return new Promise(resolve => {
    var reader = new FileReader();
    reader.onload = function(e) {
      // get file content
      var fileString = e.target.result;
      resolve(fileString);
    };
    reader.readAsText(file, "UTF-8");
    reader.onError = function(err) {
      resolve(err);
    };
  });
};

export const renderBlueprintFileUpload = props => {
  // const { input: { onChange }, cbFunction=noop } = props
  const {
    input: { onChange, value: files },
    dropzoneOptions = {},
    name,
    cbFunction = noop
  } = props;
  // return <label className="pt-file-upload ">
  //         <input onChange={function (e) {
  //           return onChange(e.target.files);
  //         }} type="file" />
  //         <span className="pt-file-upload-input">Choose file...</span>
  //       </label>
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

export const renderBlueprintSelector = props => {
  const { input, hideValue, ...rest } = props;
  return (
    <div className={"pt-select pt-fill"}>
      <select
        {...(hideValue ? { value: "" } : {})}
        {...input}
        {...removeUnwantedProps(rest)}
      />
    </div>
  );
};

export const renderMultiSelect = props => {
  // spreading input not working, grab the values needed instead
  const { input: { value, onChange }, hideValue, options, ...rest } = props;
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      {...removeUnwantedProps(rest)}
    />
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
  const compWithDefaultVal = withDefaultValue(component);
  return function FieldMaker({ name, ...rest }) {
    return <Field name={name} component={compWithDefaultVal} {...rest} />;
  };
}

export const withDefaultValue = WrappedComponent => {
  return props => {
    let defaultProps = {
      ...props,
      intent: getIntent(props),
      intentClass: getIntentClass(props),
      input: {
        ...props.input,
        value: props.input.value === ""
          ? props.defaultValue || props.input.value
          : props.input.value
      }
    };

    return (
      <AbstractInput {...props}>
        <WrappedComponent {...defaultProps} />
      </AbstractInput>
    );
  };
};

export const InputField = generateField(renderBlueprintInput);
export const FileUploadField = generateField(renderBlueprintFileUpload);
export const SelectField = generateField(renderBlueprintSelector);
export const DateInputField = generateField(renderBlueprintDateInput);
export const CheckboxField = generateField(renderBlueprintCheckbox);
export const TextareaField = generateField(renderBlueprintTextarea);
export const EditableTextField = generateField(renderBlueprintEditableText);
export const ReactSelectField = generateField(renderMultiSelect);
export const NumericInputField = generateField(renderBlueprintNumericInput);
export const RadioGroupField = generateField(renderBlueprintRadioGroup);
