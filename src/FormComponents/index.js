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
  Popover,
  PopoverInteractionKind,
  Position
} from "@blueprintjs/core";

import { DateInput } from "@blueprintjs/datetime";
function getIntentClass({ meta: { touched, error } }) {
  return touched && error ? Intent.DANGER : "";
}

function AbstractInput(props) {
  const { className, children, label, meta: { touched, error } } = props;
  const showError = touched && error;

  const target = (
    <div className={`pt-form-group ${getIntentClass(props)}`}>
      {label &&
        <label className="pt-label">
          {label}
        </label>}
      {children}
    </div>
  );
  const content = (
    <div className={"error-popover pt-form-helper-text " + Intent.DANGER}>
      {" "}{error}
    </div>
  );
  return (
    <div className={className}>

      <Popover
        isDisabled={!showError}
        defaultIsOpen
        enforceFocus={false}
        position={Position.TOP}
        interactionKind={PopoverInteractionKind.HOVER}
        content={content}
        target={target}
      />
    </div>
  );
}

export const renderBlueprintDateInput = props => {
  const { input, ...rest } = props;
  return <DateInput intent={getIntentClass(props)} {...input} {...rest} />;
};

export const renderBlueprintInput = props => {
  const { input, ...rest } = props;
  return <InputGroup intent={getIntentClass(props)} {...input} {...rest} />;
};

export const renderBlueprintCheckbox = props => {
  const { input, label, ...rest } = props;
  return <Checkbox {...input} {...rest} label={label} />;
};

export const renderBlueprintTextarea = props => {
  const { input, className, ...rest } = props;
  return (
    <textarea
      className={`${className} ${getIntentClass(props)} pt-input`}
      {...input}
      {...rest}
    />
  );
};

export const renderBlueprintEditableText = props => {
  const { input, ...rest } = props;
  return <EditableText intent={getIntentClass(props)} {...input} {...rest} />;
};

export const renderBlueprintSelector = props => {
  const { input, hideValue, ...rest } = props;
  return (
    <div className={`pt-select ${getIntentClass(props)}`}>
      <select
        className={`pt-select ${getIntentClass(props)}`}
        {...(hideValue ? { value: "" } : {})}
        {...input}
        {...rest}
      />
    </div>
  );
};

export const renderMultiSelect = props => {
  const { input, hideValue, options, ...rest } = props;
  return <Select options={options} {...input} {...rest} />;
};

export const renderBlueprintNumericInput = props => {
  const { input, hideValue, ...rest } = props;
  return (
    <NumericInput
      onValueChange={value => {
        // needed for redux form to change value
        rest.onChange ? rest.onChange(value) : input.onChange(value);
      }}
      intent={getIntentClass(props)}
      {...(hideValue ? { value: "" } : {})}
      {...input}
      {...rest}
    />
  );
};

export const renderBlueprintRadio = ({ input, label, ...rest }) => {
  return <Radio {...input} label={label} {...rest} />;
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
            {...rest}
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
    const defaultProps = {
      ...props,
      className: undefined,
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

const InputField = generateField(renderBlueprintInput);
export { InputField };
const SelectField = generateField(renderBlueprintSelector);
export { SelectField };
const DateInputField = generateField(renderBlueprintDateInput);
export { DateInputField };
const CheckboxField = generateField(renderBlueprintCheckbox);
export { CheckboxField };
const TextareaField = generateField(renderBlueprintTextarea);
export { TextareaField };
const EditableTextField = generateField(renderBlueprintEditableText);
export { EditableTextField };
const ReactSelectField = generateField(renderMultiSelect);
export { ReactSelectField };
const NumericInputField = generateField(renderBlueprintNumericInput);
export { NumericInputField };
const RadioField = generateField(renderBlueprintRadio);
export { RadioField };
