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
function getIntent({ meta: { touched, error } }) {
  return touched && error ? Intent.DANGER : "";
}

function getIntentClass({ meta: { touched, error } }) {
  return touched && error ? "pt-intent-danger" : "";
}

function removeUnwantedProps(props) {
  const cleanedProps = { ...props };
  delete cleanedProps.intent;
  delete cleanedProps.intentClass;
  delete cleanedProps.meta;
  delete cleanedProps.className;
  delete cleanedProps.tooltipError;
  delete cleanedProps.tooltipProps;
  delete cleanedProps.tabIndex;
  return cleanedProps;
}

function AbstractInput(props) {
  const {
    children,
    tooltipProps,
    tooltipError,
    label,
    meta: { touched, error }
  } = props;
  const showError = touched && error;

  return (
    <div className={`pt-form-group ${getIntentClass(props)}`}>
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

export const renderBlueprintTextarea = props => {
  const { input, intentClass, ...rest } = props;
  return (
    <textarea
      {...removeUnwantedProps(rest)}
      className={`${intentClass} pt-input pt-fill`}
      {...input}
    />
  );
};

export const renderBlueprintEditableText = props => {
  const { input, ...rest } = props;
  return (
    <EditableText
      {...input}
      onConfirm={function(...args) {
        input.onBlur && input.onBlur(...args);
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
  const { input, hideValue, intent, ...rest } = props;
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
      className={"pt-fill"}
    />
  );
};

export const renderBlueprintRadio = ({ input, label, ...rest }) => {
  return <Radio {...input} label={label} {...removeUnwantedProps(rest)} />;
};

export const BlueprintRadioGroup = ({ name, labelsAndValues, ...rest }) => {
  return (
    <RadioGroup className={"parameter-settings-radio-group"}>
      {labelsAndValues.map(function({ label, value }, index) {
        return (
          <Field
            key={index}
            label={label}
            name={name}
            type={"radio"}
            value={value}
            component={renderBlueprintRadio}
            {...removeUnwantedProps(rest)}
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
export const SelectField = generateField(renderBlueprintSelector);
export const DateInputField = generateField(renderBlueprintDateInput);
export const CheckboxField = generateField(renderBlueprintCheckbox);
export const TextareaField = generateField(renderBlueprintTextarea);
export const EditableTextField = generateField(renderBlueprintEditableText);
export const ReactSelectField = generateField(renderMultiSelect);
export const NumericInputField = generateField(renderBlueprintNumericInput);
export const RadioField = generateField(renderBlueprintRadio);
