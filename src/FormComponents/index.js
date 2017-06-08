import React from "react";
import { Field } from "redux-form";
import Select from "react-select";
import style from "./style.css";
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

function RenderAbstractInput(props) {
  const { children, label, meta: { touched, error } } = props;
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
    <Popover
      isDisabled={!showError}
      defaultIsOpen
      enforceFocus={false}
      position={Position.TOP}
      interactionKind={PopoverInteractionKind.HOVER}
      content={content}
      target={target}
    />
  );
}

export const renderBlueprintDateInput = props => {
  const { input, ...rest } = props;
  return (
    <RenderAbstractInput {...props}>
      <DateInput intent={getIntentClass(props)} {...input} {...rest} />
    </RenderAbstractInput>
  );
};

export const renderBlueprintInput = props => {
  const { input, ...rest } = props;
  return (
    <RenderAbstractInput {...props}>
      <InputGroup intent={getIntentClass(props)} {...input} {...rest} />
    </RenderAbstractInput>
  );
};

export const renderBlueprintCheckbox = props => {
  const { input, label, ...rest } = props;
  return (
    <RenderAbstractInput {...props}>
      <Checkbox {...input} {...rest} label={label} />;
    </RenderAbstractInput>
  );
};

export const renderBlueprintTextarea = props => {
  const { input, className, ...rest } = props;
  return (
    <RenderAbstractInput {...props}>
      <textarea
        className={`${className} ${getIntentClass(props)} pt-input`}
        {...input}
        {...rest}
      />
    </RenderAbstractInput>
  );
};

export const renderBlueprintEditableText = props => {
  const { input, ...rest } = props;
  return (
    <RenderAbstractInput {...props}>
      <EditableText intent={getIntentClass(props)} {...input} {...rest} />
    </RenderAbstractInput>
  );
};

export const renderBlueprintSelector = props => {
  const { input, hideValue, ...rest } = props;
  return (
    <RenderAbstractInput {...props}>
      <div className={`pt-select ${getIntentClass(props)}`}>
        <select
          className={`pt-select ${getIntentClass(props)}`}
          {...(hideValue ? { value: "" } : {})}
          {...input}
          {...rest}
        />
      </div>
    </RenderAbstractInput>
  );
};

export const renderMultiSelect = props => {
  const { input, hideValue, options, ...rest } = props;
  return (
    <RenderAbstractInput {...props}>
      <Select options={options} {...input} {...rest} />
    </RenderAbstractInput>
  );
};

export const renderBlueprintNumericInput = props => {
  const { input, hideValue, ...rest } = props;
  return (
    <RenderAbstractInput {...props}>
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
    </RenderAbstractInput>
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
      input: {
        ...props.input,
        value: props.input.value === ""
          ? props.defaultValue || props.input.value
          : props.input.value
      }
    };

    return <WrappedComponent {...defaultProps} />;
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
