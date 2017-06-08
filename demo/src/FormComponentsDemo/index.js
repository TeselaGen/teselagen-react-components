import React from "react";
import { reduxForm } from "redux-form";
import {
  InputField,
  SelectField,
  DateInputField,
  CheckboxField,
  TextareaField,
  EditableTextField,
  NumericInputField
  // ReactSelectField,
  // RadioField
} from "../../../src";
import "./style.css";
import { Provider } from "react-redux";
import store from "../store";

class FormComponentsDemo extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <h3 className="form-component-title">
            Blueprint Redux Form Components
          </h3>
          <div className="form-component">
            <NumericInputField name={'fieldnumber1'} label="Numeric Input" placeholder="0" />
          </div>
          <div className="form-component">
            <InputField name={'fieldnumber2'} label="Input" placeholder="Enter input..." />
          </div>
          <div className="form-component">
            <SelectField name={'fieldnumber3'} label="Select"  disabled={false}>
              <option value="1">Option One</option>
              <option value="2">Option Two</option>
            </SelectField>
            <div className="form-component">
              <DateInputField name={'fieldnumber5'}
                label="Date Input"
                minDate={new Date()}
                maxDate={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() + 10)
                  )
                }
              />
            </div>
            <div className="form-component">
              <CheckboxField name={'fieldnumber6'} label="Checkbox" checked={true} />
            </div>
            <div className="form-component">
              <TextareaField name={'fieldnumber7'} label="Textarea" placeholder="Enter notes..." />
            </div>
            <div className="form-component">
              <EditableTextField name={'fieldnumber8'}
                label="Editable Text"
                placeholder="Enter new text..."
              />
            </div>
            <div className="form-component" />
          </div>
        </div>
      </Provider>
    );
  }
}

export default reduxForm({
  form: "demoForm"
})(FormComponentsDemo);
