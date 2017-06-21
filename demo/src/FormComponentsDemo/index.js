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
import { Position, Button, Intent } from "@blueprintjs/core";

class FormComponentsDemo extends React.Component {
  
  render() {
    const {defaultSelectValue} = this.state || {}
    const {handleSubmit} = this.props
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
            name={"inputField2"}
            label="Input With Default"
            defaultValue={'Default Value Here!'}
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
            name={"fieldnumber3.1"}
            label="Select Simple"
          />
          <SelectField
            options={["hey", "you", "guys"]}
            name={"fieldnumber3.2"}
            defaultValue={"you"}
            label="Select Simple with defaultValue"
          />

          <SelectField
            options={["hey", "you", "guys"]}
            name={"fieldnumber3.3"}
            defaultValue={defaultSelectValue}
            label="Select Simple with defaultValue"
          />
          <Button text="Set default" onClick={()=>{
            this.setState({defaultSelectValue: "you"})
          }}>

          </Button>
          <SelectField
            options={["hey", "you", "guys"]}
            name={"fieldnumber3"}
            placeholder={"Please choose..."}
            label="Select Simple With Placeholder"
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
          <Button intent={Intent.SUCCESS} text="Submit Form" onClick={handleSubmit(function (formData) {
            console.log('formData:', formData)
          })}>
          </Button>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
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
