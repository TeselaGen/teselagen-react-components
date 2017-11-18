import React from "react";
import { reduxForm } from "redux-form";

import {
  InputField,
  SelectField,
  ReactSelectField,
  DateInputField,
  CheckboxField,
  SwitchField,
  TextareaField,
  EditableTextField,
  NumericInputField,
  RadioGroupField,
  FileUploadField
} from "../../../src";
import Uploader from "../../../src/FormComponents/Uploader";
import "./style.css";
import { Provider } from "react-redux";
import store from "../store";
import { Position, Button, Intent } from "@blueprintjs/core";
const getOptions = function(input, callback) {
  setTimeout(function() {
    callback(null, {
      options: [{ value: "one", label: "One" }, { value: "two", label: "Two" }],
      // CAREFUL! Only set this to true when there are no more options,
      // or more specific queries will not be sent to the server.
      complete: true
    });
  }, 500);
};

class FormComponentsDemo extends React.Component {
  render() {
    const { defaultSelectValue } = this.state || {};
    const { handleSubmit } = this.props;
    return (
      <Provider store={store}>
        <div className="pt-card pt-elevation-2 form-components">
          <h3 className="form-component-title">
            Blueprint Redux Form Components
          </h3>
          <Uploader
            action={"docs.google.com/upload"}
            fileList={[
              {
                uid: 1, //you must set a unique id for this to work properly
                name: "yarn.lock",
                status: "error"
              }
            ]}
          />
          <RadioGroupField
            name={"radioGroup"}
            label={"Radio Group Input"}
            defaultValue={"true"}
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            options={[
              {
                label: "Option 1",
                value: "true"
              },
              {
                label: "Option 2",
                value: ""
              }
            ]}
          />
          <NumericInputField
            secondaryLabel="(optional)"
            name={"numericInput"}
            label="Numeric Input"
            placeholder="0"
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
          />

          <FileUploadField
            label="Upload component"
            onFieldSubmit={function(fileList) {
              console.info(
                "do something with the finished file list:",
                fileList
              );
            }}
            action={"//jsonplaceholder.typicode.com/posts/"}
            name={"uploadfield"}
          />

          <InputField
            name={"inputField"}
            label="Input"
            placeholder="Enter input..."
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
          />
          <InputField
            name={"inputFieldWithDefaultValue"}
            label="Input With Default"
            defaultValue={"Default Value Here!"}
            placeholder="Enter input..."
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
          />
          <InputField
            name={"inputFieldWithTooltipError"}
            tooltipError
            tooltipProps={{
              position: Position.TOP
            }}
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            label="Input"
            placeholder="Enter input..."
          />
          <SelectField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            options={["hey", "you", "guys"]}
            name={"selectField"}
            label="Select Simple"
          />
          <SelectField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            options={[1, 2, 4]}
            name={"selectFieldWithNumbers"}
            label="Select Simple with number values passed in simplified options obj"
          />
          <SelectField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            options={["hey", "you", "guys"]}
            name={"selectFieldWithDefaultValue"}
            defaultValue={"you"}
            label="Select Simple with defaultValue"
          />

          <SelectField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            options={["hey", "you", "guys"]}
            name={"selectFieldWithPlaceholderAndInitiallyUnsetDefault"}
            defaultValue={defaultSelectValue}
            placeholder="I'm just hanging out"
            label="Select Simple with initially unset defaultValue and a placeholder"
          />
          <Button
            text="Set default"
            onClick={() => {
              this.setState({ defaultSelectValue: "you" });
            }}
          />
          <SelectField
            options={["hey", "you", "guys"]}
            name={"selectFieldWithPlaceholder"}
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            placeholder={"Please choose..."}
            label="Select Simple With Placeholder"
          />
          <SelectField
            options={["hey", "you", "guys"]}
            name={"selectFieldWithUntouchedErrors"}
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            showErrorIfUntouched
            placeholder={"Please choose..."}
            label="Select With Untouched Errors"
          />
          <SelectField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
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
            name={"selectFieldWithLabelAndValue"}
            label="Select with name and value, supporting json values"
          />
          <DateInputField
            name={"dateInputField"}
            label="Date Input"
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            minDate={new Date()}
            maxDate={
              new Date(new Date().setFullYear(new Date().getFullYear() + 10))
            }
          />
          <CheckboxField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            defaultValue
            name={"checkboxField"}
            label="Checkbox"
          />
          <SwitchField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            defaultValue
            name={"switchField"}
            label="I'm a SwitchField"
          />
          <TextareaField
            name={"textAreaField"}
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            label="Textarea"
            placeholder="Enter notes..."
          />
          <EditableTextField
            name={"editableTextField"}
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            label="Editable Text"
            placeholder="Enter new text..."
          />
          <ReactSelectField
            name="reactSelectField"
            label="Collaborators"
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            options={[
              {
                label: "Rodrigo Pavez",
                value: { name: "Rodrigo Pavez", id: "123" }
              },
              { label: "Ximena Morales", value: "Ximena Morales" },
              { label: "Kyle Craft", value: "Kyle Craft" },
              { label: "Sam Denicola", value: "Sam Denicola" },
              { label: "Tom Ogasawara", value: "Tom Ogasawara" }
            ]}
            onChange={function(val) {
              console.info("val:", val);
            }}
          />
          <ReactSelectField
            name="reactSelectFieldMulti"
            label="Collaborators Multi"
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            multi
            options={[
              {
                label: "Rodrigo Pavez",
                value: { name: "Rodrigo Pavez", id: "123" }
              },
              { label: "Ximena Morales", value: "Ximena Morales" },
              { label: "Kyle Craft", value: "Kyle Craft" },
              { label: "Sam Denicola", value: "Sam Denicola" },
              { label: "Tom Ogasawara", value: "Tom Ogasawara" }
            ]}
            onChange={function(val) {
              console.info("val:", val);
            }}
          />
          <ReactSelectField
            async
            name="reactSelectFieldMultiAsync"
            label="React Select AsyncCollaborators"
            multi
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            loadOptions={getOptions}
          />
          <Button
            intent={Intent.SUCCESS}
            text="Submit Form"
            onClick={handleSubmit(function(formData) {
              console.info("formData:", formData);
            })}
          />
        </div>
      </Provider>
    );
  }
}

const validate = values => {
  const errors = {};
  // if (!values.inputField) {
  //   errors.inputField = "required";
  // }
  // if (!values.untouchedSelect) {
  //   errors.untouchedSelect = "required";
  // }
  if (!values.inputFieldWithTooltipError) {
    errors.inputFieldWithTooltipError = "required";
  }
  if (values.dateInputField > (new Date()).setDate((new Date()).getDate() + 10)) {
    errors.dateInputField = "date too big"
  }
  return errors;
};

export default reduxForm({
  form: "demoForm",
  validate
})(FormComponentsDemo);
