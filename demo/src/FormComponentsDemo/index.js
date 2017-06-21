import React from "react";
import { reduxForm } from "redux-form";

import {
  InputField,
  SelectField,
  ReactSelectField,
  DateInputField,
  CheckboxField,
  TextareaField,
  EditableTextField,
  NumericInputField,
  RadioGroupField,
  FileUploadField,
  onEnterOrBlurHelper
} from "../../../src";
import "./style.css";
import { Provider } from "react-redux";
import store from "../store";
import { Position } from "@blueprintjs/core";

class FormComponentsDemo extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <h3 className="form-component-title">
            Blueprint Redux Form Components
          </h3>
          <RadioGroupField
            name={"fieldnumber0"}
            label={"Radio Group Input"}
            defaultValue={"false"}
            options={[
              {
                label: "Option 1",
                value: "true"
              },
              {
                label: "Option 2",
                value: "false"
              }
            ]}
          />
          <NumericInputField
            name={"fieldnumber1"}
            label="Numeric Input"
            placeholder="0"
          />
          <FileUploadField name={"fieldnumber1a"} label="File Input" />
          <InputField
            name={"inputField"}
            label="Input"
            placeholder="Enter input..."
            {...onEnterOrBlurHelper(function(argument) {
              console.log("onEnter/Blur hit");
            })}
          />
          <InputField
            name={"inputFieldWithTooltipError"}
            tooltipError
            tooltipProps={{
              position: Position.TOP
            }}
            label="Input"
            placeholder="Enter input..."
          />
          <SelectField
            options={["hey", "you", "guys"]}
            name={"fieldnumber3"}
            label="Select Simple"
            disabled={false}
          />
          <SelectField
            options={["", "you", "guys"]}
            name={"fieldnumber3a"}
            label="Select Simple With Blank Value"
            disabled={false}
          />
          <SelectField
            onChange={function () {
              console.log('arguments:', arguments)
            }}
            options={[
              {
                label: "hey",
                value: { tree: "trunk" }
              },
              {
                label: "there",
                value: "12312asd"
              },
              { label: "you", value: { tree: "graph" } },
              { label: "guys", value: { tree: "chart" } }
            ]}
            name={"fieldnumber3b"}
            label="Select with name and value"
            disabled={false}
          />
          <DateInputField
            name={"fieldnumber5"}
            label="Date Input"
            minDate={new Date()}
            maxDate={
              new Date(new Date().setFullYear(new Date().getFullYear() + 10))
            }
          />
          <CheckboxField name={"fieldnumber6"} label="Checkbox" />
          <TextareaField
            name={"fieldnumber7"}
            label="Textarea"
            placeholder="Enter notes..."
          />
          <EditableTextField
            name={"fieldnumber8"}
            {...onEnterOrBlurHelper(function(argument) {
              console.log("onEnter/Blur hit");
            })}
            label="Editable Text"
            placeholder="Enter new text..."
          />
          <ReactSelectField
            name="collaborators"
            label="Collaborators"
            multi
            options={[
              { label: "Rodrigo Pavez", value: "Rodrigo Pavez" },
              { label: "Ximena Morales", value: "Ximena Morales" },
              { label: "Kyle Craft", value: "Kyle Craft" },
              { label: "Sam Denicola", value: "Sam Denicola" },
              { label: "Tom Ogasawara", value: "Tom Ogasawara" }
            ]}
          />
        </div>
      </Provider>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.inputField) {
    errors.inputField = "required";
  }
  if (!values.inputFieldWithTooltipError) {
    errors.inputFieldWithTooltipError = "required";
  }
  return errors;
};

export default reduxForm({
  form: "demoForm",
  validate
})(FormComponentsDemo);
