import classNames from "classnames";
import { SketchPicker } from "react-color";
import { isNumber, noop, kebabCase, isPlainObject, isEqual } from "lodash";
import mathExpressionEvaluator from "math-expression-evaluator";
import React, { useContext, useState } from "react";
import { Field, touch, change } from "redux-form";

import "./style.css";
import {
  InputGroup,
  NumericInput,
  Intent,
  RadioGroup,
  Checkbox,
  EditableText,
  Tooltip,
  Position,
  Switch,
  Classes,
  FormGroup,
  Button,
  TextArea,
  Popover
} from "@blueprintjs/core";

import { DateInput, DateRangeInput } from "@blueprintjs/datetime";
import useDeepCompareEffect from "use-deep-compare-effect";
import { difference } from "lodash";
import TgSelect from "../TgSelect";
import TgSuggest from "../TgSuggest";
import InfoHelper from "../InfoHelper";
import getMomentFormatter from "../utils/getMomentFormatter";
import AsyncValidateFieldSpinner from "../AsyncValidateFieldSpinner";
import {
  AssignDefaultsModeContext,
  WorkflowDefaultParamsContext,
  workflowDefaultParamsObj
} from "../AssignDefaultsModeContext";
import Uploader from "./Uploader";
import sortify from "./sortify";
import { fieldRequired } from "./utils";

export { fieldRequired };

function getIntent({
  showErrorIfUntouched,
  meta: { touched, error, warning }
}) {
  const hasError = (touched || showErrorIfUntouched) && error;
  const hasWarning = (touched || showErrorIfUntouched) && warning;
  if (hasError) {
    return Intent.DANGER;
  } else if (hasWarning) {
    return Intent.WARNING;
  }
}

function getIntentClass(...args) {
  const intent = getIntent(...args);
  if (intent === Intent.DANGER) {
    return Classes.INTENT_DANGER;
  } else if (intent === Intent.WARNING) {
    return Classes.INTENT_WARNING;
  } else {
    return "";
  }
}

function removeUnwantedProps(props) {
  let cleanedProps = { ...props };
  delete cleanedProps.className;
  delete cleanedProps.units;
  delete cleanedProps.inlineLabel;
  delete cleanedProps.isLabelTooltip;
  delete cleanedProps.showErrorIfUntouched;
  delete cleanedProps.onChange;
  delete cleanedProps.containerStyle;
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
  delete cleanedProps.tooltipInfo;
  delete cleanedProps.tooltipProps;
  // delete cleanedProps.asyncValidate;
  // delete cleanedProps.asyncValidating;
  // delete cleanedProps.validateOnChange;
  delete cleanedProps.hasCustomError;
  delete cleanedProps.touchOnChange;
  if (cleanedProps.inputClassName) {
    cleanedProps.className = cleanedProps.inputClassName;
    delete cleanedProps.inputClassName;
  }
  return cleanedProps;
}

// will help tooltip to not get smushed
const popoverOverflowModifiers = {
  preventOverflow: { enabled: false },
  hide: {
    enabled: false
  },
  flip: {
    boundariesElement: "viewport"
  }
};

function LabelWithTooltipInfo({ label, tooltipInfo }) {
  return tooltipInfo ? (
    <div style={{ display: "flex", alignItems: "center" }}>
      {label}{" "}
      <InfoHelper
        style={{ marginLeft: "5px", marginTop: "-6px" }}
        size={12}
        content={tooltipInfo}
      />
    </div>
  ) : (
    label || null
  );
}

class AbstractInput extends React.Component {
  componentDidMount() {
    const {
      defaultValue,
      enableReinitialize,
      input: { value }
    } = this.props;
    if (
      ((value !== false && !value) || enableReinitialize) &&
      defaultValue !== undefined
    ) {
      this.updateDefaultValue();
    }
  }

  componentDidUpdate(oldProps) {
    const {
      defaultValue: oldDefaultValue,
      defaultValCount: oldDefaultValCount
    } = oldProps;
    const {
      touchOnChange,
      meta: { touched, dispatch, form },
      defaultValue,
      defaultValCount,
      enableReinitialize,
      input: { name, value }
    } = this.props;

    if (
      ((value !== false && !value) ||
        enableReinitialize ||
        defaultValCount !== oldDefaultValCount) &&
      !isEqual(defaultValue, oldDefaultValue)
    ) {
      this.updateDefaultValue();
    }

    if (touchOnChange && !touched && value !== oldProps.input.value) {
      dispatch(touch(form, name));
    }
  }

  updateDefaultValue = () => {
    const {
      defaultValue,
      input: { name },
      meta: { dispatch, form },
      onDefaultValChanged
    } = this.props;
    dispatch(change(form, name, defaultValue));
    onDefaultValChanged &&
      onDefaultValChanged(defaultValue, name, form, this.props);
  };

  render() {
    const {
      children,
      tooltipProps,
      tooltipError,
      disabled,
      intent,
      tooltipInfo,
      label,
      inlineLabel,
      isLabelTooltip,
      secondaryLabel,
      className,
      showErrorIfUntouched,
      asyncValidating,
      meta,
      containerStyle,
      leftEl,
      rightEl,
      noOuterLabel,
      assignDefaultButton,
      showGenerateDefaultDot,
      input,
      noFillField
    } = this.props;
    const { touched, error, warning } = meta;

    // if our custom field level validation is happening then we don't want to show the error visually
    const showError =
      (touched || showErrorIfUntouched) && error && !asyncValidating;
    const showWarning = (touched || showErrorIfUntouched) && warning;

    let componentToWrap =
      isLabelTooltip || tooltipError ? (
        <Tooltip
          disabled={isLabelTooltip ? false : !showError}
          intent={isLabelTooltip ? "none" : error ? "danger" : "warning"}
          content={isLabelTooltip ? label : error || warning}
          position={Position.TOP}
          modifiers={popoverOverflowModifiers}
          {...tooltipProps}
        >
          {children}
        </Tooltip>
      ) : (
        children
      );
    const testClassName = "tg-test-" + kebabCase(input.name);
    if (noFillField) {
      componentToWrap = (
        <div className="tg-no-fill-field">{componentToWrap}</div>
      );
    }

    let helperText;
    if (!tooltipError) {
      if (showError) {
        helperText = error;
      } else if (showWarning) {
        helperText = warning;
      }
    }

    return (
      <FormGroup
        className={classNames(className, testClassName, {
          "tg-flex-form-content": leftEl || rightEl,
          "tg-tooltipError": tooltipError
        })}
        disabled={disabled}
        helperText={helperText}
        intent={intent}
        label={
          !isLabelTooltip &&
          !noOuterLabel && (
            <LabelWithTooltipInfo label={label} tooltipInfo={tooltipInfo} />
          )
        }
        inline={inlineLabel}
        labelInfo={secondaryLabel}
        style={containerStyle}
      >
        {showGenerateDefaultDot && (
          <div
            style={{ zIndex: 10, position: "relative", height: 0, width: 0 }}
          >
            <Tooltip content="Allows a Default to be Set. Enter Set Default Mode by pressing Shift+D">
              <div className="generateDefaultDot"></div>
            </Tooltip>
          </div>
        )}
        {assignDefaultButton}
        {leftEl} {componentToWrap} {rightEl}
      </FormGroup>
    );
  }
}

export const renderBlueprintDateInput = props => {
  const { input, intent, onFieldSubmit, inputProps, ...rest } = props;
  return (
    <DateInput
      {...getMomentFormatter("MM/DD/YYYY")}
      {...removeUnwantedProps(rest)}
      intent={intent}
      inputProps={inputProps}
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
  const { input, intent, onFieldSubmit, inputProps, ...rest } = props;

  return (
    <DateRangeInput
      {...getMomentFormatter("MM/DD/YYYY")}
      {...removeUnwantedProps(rest)}
      intent={intent}
      inputProps={inputProps}
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
  const {
    input,
    // meta = {},
    intent,
    onFieldSubmit,
    onKeyDown = noop,
    asyncValidating,
    rightElement,
    ...rest
  } = props;
  return (
    <InputGroup
      rightElement={
        asyncValidating ? (
          <AsyncValidateFieldSpinner validating />
        ) : (
          rightElement
        )
      }
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
        if (rest.readOnly) return;
        input.onBlur(e, val);
        onFieldSubmit(e.target ? e.target.value : val, { blur: true }, e);
      }}
    />
  );
};

export const renderBlueprintCheckbox = props => {
  const { input, label, tooltipInfo, onFieldSubmit, ...rest } = props;
  return (
    <Checkbox
      {...removeUnwantedProps(rest)}
      {...input}
      checked={input.value}
      label={<LabelWithTooltipInfo label={label} tooltipInfo={tooltipInfo} />}
      onChange={function(e, val) {
        input.onChange(e, val);
        onFieldSubmit(e.target ? e.target.checked : val);
      }}
    />
  );
};

export const renderBlueprintSwitch = props => {
  const { input, label, tooltipInfo, onFieldSubmit, ...rest } = props;
  return (
    <Switch
      {...removeUnwantedProps(rest)}
      {...input}
      checked={input.value}
      label={<LabelWithTooltipInfo label={label} tooltipInfo={tooltipInfo} />}
      onChange={function(e, val) {
        input.onChange(e, val);
        onFieldSubmit(e.target ? e.target.checked : val);
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

export class renderBlueprintTextarea extends React.Component {
  state = {
    value: null,
    isOpen: false
  };
  allowEdit = () => {
    this.setState({ isOpen: true });
  };
  stopEdit = () => {
    this.setState({ isOpen: false });
    this.setState({ value: null });
  };
  updateVal = e => {
    this.setState({ value: e.target.value });
  };
  handleValSubmit = () => {
    this.props.input.onChange(
      this.state.value === null ? this.props.input.value : this.state.value
    );
    this.props.onFieldSubmit(
      this.state.value === null ? this.props.input.value : this.state.value,
      { cmdEnter: true }
    );
    this.stopEdit();
  };
  onKeyDown = (...args) => {
    const e = args[0];
    (this.props.onKeyDown || noop)(...args);
    if (e.keyCode === 13 && (e.metaKey || e.ctrlKey)) {
      this.props.onFieldSubmit(e.target.value, { cmdEnter: true }, e);
      this.props.input.onChange(e);
      this.stopEdit();
    }
  };
  render() {
    const {
      input,
      intentClass,
      inputClassName,
      onFieldSubmit,
      clickToEdit,
      onKeyDown,
      ...rest
    } = this.props;
    if (clickToEdit) {
      const isDisabled = clickToEdit && !this.state.isOpen;

      return (
        <React.Fragment>
          <TextArea
            {...removeUnwantedProps(rest)}
            disabled={rest.disabled || isDisabled}
            className={classNames(
              intentClass,
              inputClassName,
              Classes.INPUT,
              Classes.FILL
            )}
            value={this.state.value === null ? input.value : this.state.value}
            onChange={this.updateVal}
            onKeyDown={this.onKeyDown}
          />
          {clickToEdit &&
            (this.state.isOpen ? (
              //show okay/cancel buttons
              <div>
                <Button onClick={this.stopEdit} intent="danger">
                  Cancel
                </Button>
                <Button onClick={this.handleValSubmit} intent="success">
                  Ok
                </Button>
              </div>
            ) : (
              //show click to edit button
              <Button onClick={this.allowEdit}>Edit</Button>
            ))}
        </React.Fragment>
      );
    } else {
      return (
        <TextArea
          {...removeUnwantedProps(rest)}
          className={classNames(
            intentClass,
            inputClassName,
            Classes.INPUT,
            Classes.FILL
          )}
          {...input}
          onBlur={function(e, val) {
            if (rest.readOnly) return;
            input.onBlur(e, val);
            onFieldSubmit(e.target ? e.target.value : val, { blur: true }, e);
          }}
          onKeyDown={(...args) => {
            const e = args[0];
            (onKeyDown || noop)(...args);
            if (e.keyCode === 13 && (e.metaKey || e.ctrlKey)) {
              onFieldSubmit(e.target.value, { cmdEnter: true }, e);
            }
          }}
        />
      );
    }
  }
}

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
        onFieldSubmit(value, { input, meta: rest.meta });
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
    intent,
    options,
    onFieldSubmit,
    ...rest
  } = props;

  let optionsPassed = options;

  const optsToUse = getOptions(optionsPassed);
  let valueToUse;

  if (!Array.isArray(value) && typeof value === "object") {
    if (value.userCreated) {
      valueToUse = {
        label: value.value,
        value
      };
    } else {
      valueToUse = optsToUse.find(obj => {
        return isEqual(obj.value, value);
      });
    }
  } else if (Array.isArray(value)) {
    valueToUse = value.map(val => {
      if (val.userCreated) {
        return {
          label: val.value,
          value: val
        };
      }
      if (optsToUse) {
        return optsToUse.find(obj => {
          return isEqual(obj.value, val);
        });
      } else {
        return val;
      }
    });
  } else {
    valueToUse = value;
  }

  const propsToUse = {
    ...removeUnwantedProps(rest),
    intent,
    options: optsToUse,
    value: valueToUse,
    // closeOnSelect: !rest.multi,
    onChange(valOrVals, ...rest2) {
      let valToPass;
      if (Array.isArray(valOrVals)) {
        valToPass = valOrVals.map(function(val) {
          if (val.userCreated) {
            return val;
          }
          return val.value;
        });
      } else if (valOrVals) {
        if (valOrVals.userCreated) {
          valToPass = valOrVals;
        } else {
          valToPass = valOrVals.value;
        }
      } else {
        valToPass = "";
      }
      if (props.cancelSubmit && props.cancelSubmit(valToPass)) {
        //allow the user to cancel the submit
        return;
      }
      onChange(valToPass, ...rest2);
      if (!rest.submitOnBlur) onFieldSubmit(valToPass);
    },
    onBlur() {
      const valToPass = Array.isArray(valueToUse)
        ? valueToUse
            .filter(val => !!val)
            .map(function(val) {
              return val.value;
            })
        : valueToUse;
      if (props.cancelSubmit && props.cancelSubmit(valToPass)) {
        return; //allow the user to cancel the submit
      }
      if (rest.submitOnBlur) {
        onFieldSubmit(valToPass);
      }
    }
  };
  return <TgSelect {...propsToUse} />;
};

export const renderSuggest_old = props => {
  return renderReactSelect({ ...props, asSuggest: true });
};

export const renderSuggest = props => {
  const {
    async,
    input: { value, onChange },
    hideValue,
    intent,
    options,
    onFieldSubmit,
    ...rest
  } = props;

  const propsToUse = {
    ...removeUnwantedProps(rest),
    intent,
    options,
    value,
    onChange(val) {
      onChange(val);
      if (!rest.submitOnBlur) onFieldSubmit(val);
    },
    onBlur() {
      if (rest.submitOnBlur) {
        onFieldSubmit(value);
      }
    }
  };
  return <TgSuggest {...propsToUse}></TgSuggest>;
};

export const BPSelect = ({ value, onChange, ...rest }) => {
  return renderSelect({ ...rest, input: { onChange, value } });
};

export const renderSelect = props => {
  // spreading input not working, grab the values needed instead
  const {
    input: { value, onChange },
    hideValue,
    className,
    placeholder,
    onFieldSubmit,
    options,
    hidePlaceHolder,
    minimal,
    disabled,
    ...rest
  } = props;
  return (
    <div
      className={
        `${minimal && Classes.MINIMAL} ` +
        classNames(Classes.SELECT, Classes.FILL, className)
      }
    >
      <select
        {...removeUnwantedProps(rest)}
        className={`${disabled && Classes.DISABLED} `}
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
            const maybeNewValue = JSON.parse(e.target.value); //try to json parse the string coming in
            const hasMatchInOriginalOptions = options.find(
              opt => opt === maybeNewValue || opt.value === maybeNewValue
            );
            if (hasMatchInOriginalOptions || isPlainObject(maybeNewValue)) {
              val = maybeNewValue;
            }
          } catch (e) {
            //empty
          }
          onChange(val);
          onFieldSubmit && onFieldSubmit(val);
        }}
      >
        {placeholder && (
          <option value="__placeholder__" disabled hidden={hidePlaceHolder}>
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
    onAnyNumberChange,
    ...rest
  } = props;
  function handleBlurOrButtonClick(stringVal) {
    if (rest.readOnly) return;
    try {
      const num = mathExpressionEvaluator.eval(stringVal);
      input.onBlur(num);
      onFieldSubmit(num);
    } catch (e) {
      console.error(
        "TRC: Error occurring when setting evaluated numeric input field:",
        e
      );
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
      className={classNames(Classes.FILL, inputClassName)}
      onValueChange={(numericVal, stringVal) => {
        // needed for redux form to change value
        input.onChange(stringVal);
        //tnr: use this handler if you want to listen to all value changes!
        onAnyNumberChange && onAnyNumberChange(numericVal);
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
  const optionsToUse = getOptions(options);
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
      options={optionsToUse}
    />
  );
};

export class RenderReactColorPicker extends React.Component {
  handleChange = color => {
    const { input, onFieldSubmit } = this.props;

    input.onChange(color.hex);
    onFieldSubmit(color.hex);
  };

  render() {
    const { input, onFieldSubmit, ...rest } = this.props;
    return (
      <React.Fragment>
        <Popover
          position="bottom-right"
          minimal
          modifiers={{
            preventOverflow: { enabled: false },
            hide: {
              enabled: false
            },
            flip: {
              boundariesElement: "viewport"
            }
          }}
          content={
            <SketchPicker
              className="tg-color-picker-selector"
              color={input.value}
              onChangeComplete={this.handleChange}
              {...removeUnwantedProps(rest)}
            />
          }
        >
          <div
            style={{
              padding: "5px",
              background: "#fff",
              borderRadius: "1px",
              boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
              display: "inline-block",
              cursor: "pointer"
            }}
          >
            <div
              className="tg-color-picker-selected-color"
              style={{
                width: "36px",
                height: "14px",
                borderRadius: "2px",
                background: `${input.value}`
              }}
            />
          </div>
        </Popover>
      </React.Fragment>
    );
  }
}

// tgreen: This doesn't work because the async validate function will not be automatically rerun onSubmit
// class AddAsyncValidate extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       asyncValidating: false
//     };
//     this.runAsyncValidationDebounced = debounce(this.runAsyncValidation, 500);
//   }

//   componentDidUpdate(oldProps) {
//     const {
//       validateOnChange,
//       input: { name, value },
//       meta: { touched, form, dispatch }
//     } = this.props;
//     const newValue = value;
//     const oldValue = oldProps.input.value;
//     const valueHasChanged = newValue !== oldValue;
//     if (validateOnChange && valueHasChanged) {
//       this.runAsyncValidationDebounced(newValue);
//     }
//     // mark the input as touched after changing value
//     if (valueHasChanged && !touched) {
//       dispatch(touch(form, name));
//     }
//   }

//   triggerAsyncValidation(error) {
//     const {
//       input: { name },
//       meta: { dispatch, form },
//       formAsyncErrors
//     } = this.props;
//     // this needs to get a fresh prop for formAsyncErrors otherwise it will get out of sync.
//     // the test will catch this.
//     dispatch(
//       stopAsyncValidation(form, {
//         ...formAsyncErrors,
//         [name]: error
//       })
//     );
//   }

//   runAsyncValidation = async val => {
//     const {
//       input: { name },
//       meta: { dispatch, form },
//       asyncValidate
//     } = this.props;

//     this.setState({
//       asyncValidating: true
//     });
//     // mark this field as invalid so that the user can not submit this form while async validating
//     this.triggerAsyncValidation("asyncValidating");
//     dispatch(startAsyncValidation(form));
//     const error = await asyncValidate(val);
//     this.triggerAsyncValidation(error);
//     // if there is no error then clear it from redux
//     if (!error) {
//       dispatch(clearAsyncError(form, name));
//     }

//     this.setState({
//       asyncValidating: false
//     });

//     return error;
//   };

//   onBlur = (...args) => {
//     const { input } = this.props;
//     // always run this on input blur so that the user cannot submit a form with a field that has not finished validating
//     this.runAsyncValidation(input.value);
//     input.onBlur(...args);
//   };

//   render() {
//     const { asyncValidating } = this.state;
//     const {
//       passedComponent: Component,
//       input,
//       formAsyncErrors, // don't pass through
//       dispatch, // don't pass through
//       ...rest
//     } = this.props;

//     return (
//       <Component
//         {...rest}
//         input={{
//           ...input,
//           onBlur: this.onBlur
//         }}
//         asyncValidating={asyncValidating}
//       />
//     );
//   }
// }

// const WrappedAddAsyncValidate = connect((state, { meta }) => {
//   return {
//     formAsyncErrors: getFormAsyncErrors(meta.form)(state)
//   };
// })(AddAsyncValidate);

export function generateField(component, opts) {
  const compWithDefaultVal = withAbstractWrapper(component, opts);
  return function FieldMaker({
    name,
    isRequired,
    onFieldSubmit = noop,
    // asyncValidate,
    ...rest
  }) {
    let component = compWithDefaultVal;

    let props = {
      onFieldSubmit,
      name,
      component,
      ...(isRequired && { validate: fieldRequired }),
      ...rest
    };

    // if (asyncValidate) {
    //   props = {
    //     ...props,
    //     asyncValidate,
    //     component: WrappedAddAsyncValidate,
    //     passedComponent: component
    //   };
    // }

    return <Field {...props} />;
  };
}

export const withAbstractWrapper = (ComponentToWrap, opts = {}) => {
  return props => {
    const {
      generateDefaultValue,
      defaultValue: defaultValueFromProps,
      ...rest
    } = props;
    //get is assign defaults mode
    //if assign default value mode then add on to the component
    const [count, updateCount] = React.useState(0);
    const [defaultValCount, setDefaultValCount] = React.useState(0);
    const [defaultValueFromBackend, setDefault] = useState();
    const [allowUserOverride, setUserOverride] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const { inAssignDefaultsMode } = useContext(AssignDefaultsModeContext);
    const workflowParams = useContext(WorkflowDefaultParamsContext);

    const caresAboutToolContext = generateDefaultValue?.params?.toolName;

    const customParamsToUse = {
      ...(caresAboutToolContext
        ? { ...workflowDefaultParamsObj, ...workflowParams }
        : {}),
      ...(generateDefaultValue ? generateDefaultValue.customParams : {})
    };
    // if generateDefaultValue, hit the backend for that value
    useDeepCompareEffect(() => {
      if (!window.__triggerGetDefaultValueRequest) return;
      if (!generateDefaultValue) return;
      setLoading(true);
      //custom params should match params keys. if not throw an error
      const doParamsMatch = isEqual(
        Object.keys({
          ...(caresAboutToolContext ? workflowDefaultParamsObj : {}), //we don't want to compare these keys so we just spread them here
          ...(generateDefaultValue.params || {})
        }).sort(),
        Object.keys(customParamsToUse).sort()
      );
      if (!doParamsMatch) {
        console.warn(
          `Issue with generateDefaultValue. customParams don't match params`
        );
        console.warn(
          `generateDefaultValue.params:`,
          generateDefaultValue.params
        );
        console.warn(`generateDefaultValue.customParams:`, customParamsToUse);
        throw new Error(
          `Issue with generateDefaultValue code=${
            generateDefaultValue.code
          }: Difference detected with: ${difference(
            Object.keys(generateDefaultValue.params || {}),
            Object.keys(customParamsToUse || {})
          ).join(
            ", "
          )}. customParams passed into the field should match params (as defined in defaultValueConstants.js). See console for more details.`
        );
      }

      (async () => {
        try {
          const res = await window.__triggerGetDefaultValueRequest(
            generateDefaultValue.code,
            customParamsToUse
          );
          if (
            ComponentToWrap === renderBlueprintCheckbox ||
            ComponentToWrap === renderBlueprintSwitch
          ) {
            setDefault(res.defaultValue === "true");
          } else {
            setDefault(res.defaultValue);
          }
          setUserOverride(res.allowUserOverride);
          setDefaultValCount(defaultValCount + 1);
        } catch (error) {
          console.error(`error aswf298f:`, error);
        }
        setLoading(false);
      })();
    }, [generateDefaultValue || {}, count]);
    // const asyncValidating = props.asyncValidating;
    let defaultProps = {
      ...rest,
      defaultValue: defaultValueFromBackend || defaultValueFromProps,
      disabled: props.disabled || allowUserOverride === false,
      readOnly: props.readOnly || isLoading,
      intent: getIntent(props),
      intentClass: getIntentClass(props)
    };

    // don't show intent while async validating
    // if (asyncValidating) {
    //   delete defaultProps.intent;
    //   delete defaultProps.intentClass;
    // }
    return (
      <React.Fragment>
        <AbstractInput
          {...{
            ...opts,
            defaultValCount,
            ...defaultProps,
            showGenerateDefaultDot:
              !inAssignDefaultsMode &&
              window.__showGenerateDefaultDot &&
              window.__showGenerateDefaultDot() &&
              !!generateDefaultValue,
            assignDefaultButton: inAssignDefaultsMode && generateDefaultValue && (
              <Button
                onClick={() =>
                  window.__showAssignDefaultValueModal &&
                  window.__showAssignDefaultValueModal({
                    ...props,
                    generateDefaultValue: {
                      ...props.generateDefaultValue,
                      customParams: customParamsToUse
                    },
                    onFinish: () => {
                      updateCount(count + 1);
                    }
                  })
                }
                small
                style={{ background: "yellow", color: "black" }}
              >
                Assign Default
              </Button>
            )
          }}
        >
          <ComponentToWrap {...defaultProps} />
        </AbstractInput>
      </React.Fragment>
    );
  };
};

export const InputField = generateField(renderBlueprintInput);
export const FileUploadField = generateField(renderFileUpload);
export const DateInputField = generateField(renderBlueprintDateInput);
export const DateRangeInputField = generateField(renderBlueprintDateRangeInput);
export const CheckboxField = generateField(renderBlueprintCheckbox, {
  noOuterLabel: true,
  noFillField: true
});
export const SwitchField = generateField(renderBlueprintSwitch, {
  noOuterLabel: true,
  noFillField: true
});
export const TextareaField = generateField(renderBlueprintTextarea);
export const SuggestField = generateField(renderSuggest);
export const EditableTextField = generateField(renderBlueprintEditableText);
export const NumericInputField = generateField(renderBlueprintNumericInput);
export const RadioGroupField = generateField(renderBlueprintRadioGroup, {
  noFillField: true
});
export const ReactSelectField = generateField(renderReactSelect);
export const SelectField = generateField(renderSelect);
export const ReactColorField = generateField(RenderReactColorPicker);

function getOptions(options) {
  return (
    options &&
    options.map(function(opt) {
      if (typeof opt === "string") {
        return { label: opt, value: opt };
      } else if (isNumber(opt)) return { label: opt.toString(), value: opt };
      return opt;
    })
  );
}
