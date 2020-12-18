/* eslint-disable no-console */

import React from "react";
import { Provider } from "react-redux";
import { reduxForm } from "redux-form";
import { Switch, Icon, Button, MenuItem } from "@blueprintjs/core";
import store from "../store";
import Uploader from "../../../src/FormComponents/Uploader";
import {
  RadioGroupField,
  NumericInputField,
  FileUploadField,
  InputField,
  SelectField,
  BPSelect,
  DateRangeInputField,
  DateInputField,
  CheckboxField,
  SwitchField,
  TextareaField,
  EditableTextField,
  ReactSelectField,
  ReactColorField,
  SuggestField,
  InfoHelper
} from "../../../src";
import renderToggle from "../renderToggle";

// const getOptions = function(input, callback) {
//   setTimeout(function() {
//     callback(null, {
//       options: [{ value: "one", label: "One" }, { value: "two", label: "Two" }],
//       // CAREFUL! Only set this to true when there are no more options,
//       // or more specific queries will not be sent to the server.
//       complete: true
//     });
//   }, 500);
// };

class FormComponentsDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inlineLabels: false
    };
  }
  render() {
    const { defaultSelectValue } = this.state || {};
    const { handleSubmit } = this.props;
    return (
      <Provider store={store}>
        <div className="form-components">
          <h3 className="form-component-title">
            Blueprint Redux Form Components
          </h3>
          ################################################################################################
          <h4>Options</h4>
          <Switch
            checked={this.state.inlineLabels}
            label="Toggle Inline Labels"
            onChange={() => {
              this.setState({ inlineLabels: !this.state.inlineLabels });
            }}
          >
            <br />
            <br />
            ################################################################################################{" "}
          </Switch>
          <Uploader
            threeDotMenuItems={
              <MenuItem
                text={
                  <div style={{ display: "flex", alignContent: "center" }}>
                    Download Example File &nbsp;&nbsp;
                    <InfoHelper content="I'm some helper text"></InfoHelper>
                  </div>
                }
              ></MenuItem>
            }
            action={"docs.google.com/upload"}
            fileList={[
              {
                uid: 1, //you must set a unique id for this to work properly
                name: "yarn.lock",
                status: "error"
              }
            ]}
          />
          Importer with minimal=true
          <div style={{ display: "flex" }}>
            <Button>Hey there</Button>
            &nbsp;
            <Uploader
              threeDotMenuItems={
                <MenuItem text="Download Example File"> </MenuItem>
              }
              accept=".json"
              action={"docs.google.com/upload"}
              minimal
              fileList={[
                {
                  uid: 1, //you must set a unique id for this to work properly
                  name: "yarn.lock",
                  status: "error"
                }
              ]}
            />
            &nbsp;
          </div>
          FileUploadField with minimal=true
          <FileUploadField
            threeDotMenuItems={
              <MenuItem text="Download Example File"> </MenuItem>
            }
            innerText="Upload"
            minimal
            fileList={[
              {
                uid: 1, //you must set a unique id for this to work properly
                name: "yarn.lock",
                status: "error"
              }
            ]}
            label="Upload component"
            tooltipInfo="hello hello I'm tooltipInfo"
            onFieldSubmit={function(fileList) {
              console.info(
                "do something with the finished file list:",
                fileList
              );
            }}
            action={"//jsonplaceholder.typicode.com/posts/"}
            name={"uploadfield"}
            inlineLabel={this.state.inlineLabels}
          />
          <RadioGroupField
            name={"radioGroup"}
            inlineLabel={this.state.inlineLabels}
            label={"Radio Group Input"}
            tooltipInfo="hello hello I'm tooltipInfo"
            defaultValue={"true"}
            onFieldSubmit={onFieldSubmit}
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
            generateDefaultValue={{}} //just here to see the css
            secondaryLabel="(optional)"
            name={"numericInput"}
            tooltipInfo="hello hello I'm tooltipInfo"
            inlineLabel={this.state.inlineLabels}
            label="Numeric Input"
            placeholder="0"
            onFieldSubmit={onFieldSubmit}
          />
          <FileUploadField
            threeDotMenuItems={
              <MenuItem text="Download Example File"> </MenuItem>
            }
            label="Upload component"
            tooltipInfo="hello hello I'm tooltipInfo"
            onFieldSubmit={function(fileList) {
              console.info(
                "do something with the finished file list:",
                fileList
              );
            }}
            action={"//jsonplaceholder.typicode.com/posts/"}
            name={"uploadfield"}
            inlineLabel={this.state.inlineLabels}
          />
          <InputField
            name={"inputFieldWithDefaultValue"}
            inlineLabel={this.state.inlineLabels}
            label="Input With Default"
            defaultValue={"Default Value Here!"}
            placeholder="Enter input..."
            onFieldSubmit={onFieldSubmit}
            containerStyle={{ background: "black", height: 200 }}
          />
          <InputField
            name={"inputFieldWithTooltipError"}
            inlineLabel={this.state.inlineLabels}
            tooltipError
            tooltipProps={{
              position: "top"
            }}
            onFieldSubmit={onFieldSubmit}
            label="Input"
            placeholder="Enter input..."
          />
          <SelectField
            tooltipInfo="hello hello I'm tooltipInfo"
            onFieldSubmit={onFieldSubmit}
            options={["hey", "you", "guys"]}
            name={"selectField"}
            inlineLabel={this.state.inlineLabels}
            label="Select Simple"
          />
          <InputField
            name={"inlineinputFieldWithTooltipError"}
            inlineLabel={this.state.inlineLabels}
            tooltipError
            tooltipProps={{
              position: "top"
            }}
            onFieldSubmit={onFieldSubmit}
            label="Input with toolTip error with inlineLabel = true"
            placeholder="Enter input..."
          />
          <SelectField
            onFieldSubmit={onFieldSubmit}
            options={["hey", "you", "guys"]}
            name={"inlineselectField"}
            inlineLabel={this.state.inlineLabels}
            label="Select Simple with inlineLabel = true"
          />
          {"<BPSelect onChange value /> component (not redux form connected):"}
          <BPSelect
            onChange={onFieldSubmit}
            value="hey"
            options={["hey", "you", "guys"]}
            name={"inlineselectField"}
            inlineLabel={this.state.inlineLabels}
            label="Select Simple with inlineLabel = true"
          />
          {
            "<BPSelect onChange value /> component with className bp3-minimal passed (not redux form connected):"
          }
          <BPSelect
            onChange={onFieldSubmit}
            minimal
            value="hey"
            options={["hey", "you", "guys"]}
            name={"inlineselectField"}
            inlineLabel={this.state.inlineLabels}
            label="minimal Select Simple with inlineLabel = true"
          />
          <SelectField
            onFieldSubmit={onFieldSubmit}
            options={[1, 2, 4]}
            name={"selectFieldWithNumbers"}
            inlineLabel={this.state.inlineLabels}
            label="Select Simple with number values passed in simplified options obj"
          />
          <SelectField
            onFieldSubmit={onFieldSubmit}
            options={["hey", "you", "guys"]}
            name={"selectFieldWithDefaultValue"}
            inlineLabel={this.state.inlineLabels}
            defaultValue={"you"}
            label="Select Simple with defaultValue"
          />
          <SelectField
            onFieldSubmit={onFieldSubmit}
            options={["hey", "you", "guys"]}
            name={"selectFieldWithPlaceholderAndInitiallyUnsetDefault"}
            inlineLabel={this.state.inlineLabels}
            defaultValue={defaultSelectValue}
            placeholder="Choose one of the following..."
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
            inlineLabel={this.state.inlineLabels}
            onFieldSubmit={onFieldSubmit}
            placeholder={"Please choose..."}
            label="Select Simple With Placeholder"
          />
          <SelectField
            options={["hey", "you", "guys"]}
            name={"selectFieldWithUntouchedErrors"}
            inlineLabel={this.state.inlineLabels}
            onFieldSubmit={onFieldSubmit}
            showErrorIfUntouched
            placeholder={"Please choose..."}
            label="Select With Untouched Errors"
          />
          <SelectField
            onFieldSubmit={onFieldSubmit}
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
            inlineLabel={this.state.inlineLabels}
            label="Select with name and value, supporting json values"
          />
          <DateInputField
            name={"dateInputField"}
            inlineLabel={this.state.inlineLabels}
            label="Date Input"
            onFieldSubmit={onFieldSubmit}
            defaultValue={new Date()}
          />
          <DateRangeInputField
            name={"dateRangeInputField"}
            inlineLabel={this.state.inlineLabels}
            label="Date Range Input"
            onFieldSubmit={onFieldSubmit}
            minDate={new Date()}
            maxDate={
              new Date(new Date().setFullYear(new Date().getFullYear() + 1000))
            }
          />
          <CheckboxField
            onFieldSubmit={onFieldSubmit}
            defaultValue
            tooltipInfo={"I am some info!"}
            name={"CheckboxField"}
            inlineLabel={this.state.inlineLabels}
            label="CheckboxField"
          />
          <CheckboxField
            onFieldSubmit={onFieldSubmit}
            defaultValue
            name={"CheckboxField 2"}
            inlineLabel={this.state.inlineLabels}
            label={
              <span>
                CheckboxField Label and Icon <Icon icon="tick" />
              </span>
            }
          />
          <SwitchField
            onFieldSubmit={onFieldSubmit}
            defaultValue
            name={"SwitchField"}
            inlineLabel={this.state.inlineLabels}
            label="I'm a SwitchField"
          />
          <TextareaField
            isRequired
            name={"textAreaField"}
            inlineLabel={this.state.inlineLabels}
            onFieldSubmit={onFieldSubmit}
            label="TextareaField"
            placeholder="Enter notes..."
          />
          <TextareaField
            clickToEdit
            name={"textAreaFieldWithClickToEdit"}
            inlineLabel={this.state.inlineLabels}
            onFieldSubmit={onFieldSubmit}
            label="TextareaField with clickToEdit=true"
            placeholder="Enter notes..."
          />
          <EditableTextField
            name={"editableTextField"}
            inlineLabel={this.state.inlineLabels}
            onFieldSubmit={onFieldSubmit}
            label="EditableTextField"
            placeholder="Enter new text..."
          />
          <SuggestField
            name="suggestField"
            inlineLabel={this.state.inlineLabels}
            label="SuggestField Collaborators"
            options={[
              "Rodrigo Pavez aoiwjefoiawjfiojawe faowijefoiajwefoijawf woaiefjawoie",
              "Ximena Morales",
              "Kyle Craft",
              "Sam Denicola",
              "Tom Ogasawara Og Og Og"
            ]}
          />
          {renderToggle({
            that: this,
            label: "creatable",
            type: "reactSelectFieldcreatable"
          })}
          {renderToggle({
            that: this,
            label: "disallowClear",
            type: "reactSelectFielddisallowClear"
          })}
          <ReactSelectField
            name="reactSelectField"
            resetOnSelect
            disallowClear={this.state.reactSelectFielddisallowClear}
            inlineLabel={this.state.inlineLabels}
            label="ReactSelectField Collaborators"
            placeholder="This has a long placeholder, wow, I hope it fits"
            onFieldSubmit={onFieldSubmit}
            creatable={this.state.reactSelectFieldcreatable}
            options={[
              {
                label:
                  "Rodrigo Pavez aoiwjefoiawjfiojawe faowijefoiajwefoijawf woaiefjawoie",
                value: { name: "Rodrigo Pavez", id: "123" }
              },
              { label: "Ximena Morales", value: "Ximena Morales" },
              { label: "Kyle Craft", value: "Kyle Craft" },
              { label: "Sam Denicola", value: "Sam Denicola" },
              { label: "Tom Ogasawara Og Og Og", value: "Tom Ogasawara" }
            ]}
          />
          <ReactSelectField
            name="reactSelectFieldCustomLabel"
            inlineLabel={this.state.inlineLabels}
            label="ReactSelectField Custom Label"
            onFieldSubmit={onFieldSubmit}
            creatable={this.state.reactSelectFieldcreatable}
            options={["hah", "yah", "nope", "yep"].map((type, i) => {
              return {
                value: type,
                label: (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: 10
                    }}
                  >
                    <Icon icon="chat" />
                    <div
                      style={{
                        // background: featureColors[type], add back in if we want colors. import from vesequtils
                        height: 15,
                        width: 15,
                        marginRight: 5
                      }}
                    />
                    {type}
                  </div>
                )
              };
            })}
          />
          <ReactSelectField
            name="reactSelectFieldMulti"
            inlineLabel={this.state.inlineLabels}
            label="ReactSelectField Collaborators Multi"
            onFieldSubmit={onFieldSubmit}
            resetOnSelect
            creatable={this.state.reactSelectFieldcreatable}
            multi
            defaultValue={["Ximena Morales", "Sam Denicola"]}
            options={[
              {
                label: "Rodrigo Pavez",
                value: { name: "Rodrigo Pavez", id: "123" }
              },
              {
                label: "Ximena Morales",
                value: "Ximena Morales",
                disabled: true
              },
              { label: "Kyle Craft", value: "Kyle Craft" },
              { label: "Sam Denicola", value: "Sam Denicola" },
              { label: "Tom Ogasawara", value: "Tom Ogasawara" }
            ]}
          />
          <ReactSelectField
            name="reactSelectFieldDisabled"
            inlineLabel={this.state.inlineLabels}
            label="ReactSelectField Disabled"
            onFieldSubmit={onFieldSubmit}
            multi
            disabled
            defaultValue={["Ximena Morales"]}
            options={[
              {
                label: "Rodrigo Pavez",
                value: { name: "Rodrigo Pavez", id: "123" }
              },
              {
                label: "Ximena Morales",
                value: "Ximena Morales"
              },
              { label: "Kyle Craft", value: "Kyle Craft" },
              { label: "Sam Denicola", value: "Sam Denicola" },
              { label: "Tom Ogasawara", value: "Tom Ogasawara" }
            ]}
          />
          <ReactColorField
            name="reactColorField"
            inlineLabel={this.state.inlineLabels}
            label="ReactColorField"
            onFieldSubmit={onFieldSubmit}
          />
          <Button
            intent="success"
            text="Submit Form"
            onClick={handleSubmit(function(formData) {
              console.info("submitted data:", formData);
            })}
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
  if (!values.untouchedSelect) {
    errors.untouchedSelect = "required";
  }
  if (!values.inputFieldWithTooltipError) {
    errors.inputFieldWithTooltipError = "required";
  }
  if (!values.reactSelectField) {
    errors.reactSelectField = "required";
  }
  if (values.dateInputField > new Date().setDate(new Date().getDate() + 10)) {
    errors.dateInputField = "date too big";
  }
  return errors;
};

export default reduxForm({
  form: "demoForm",
  validate
})(FormComponentsDemo);

function onFieldSubmit(val) {
  console.info("on field submit", val);
}
