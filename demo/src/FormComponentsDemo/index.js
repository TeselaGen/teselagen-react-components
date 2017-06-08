import React from 'react'
import { reduxForm } from 'redux-form'
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
} from '../../../src/FormComponents'

import './style.css'

class FormComponentsDemo extends React.Component {
  render() {
    return (
      <div>
        <h3 className="form-component-title">
          Blueprint Redux Form Components
        </h3>
        <div className="form-component">
          <NumericInputField label="Numeric Input" placeholder="0" />
        </div>
        <div className="form-component">
          <InputField label="Input" placeholder="Enter input..." />
        </div>
        <div className="form-component">
          <SelectField label="Select" name="source" disabled={false}>
            <option value="1">Option One</option>
            <option value="2">Option Two</option>
          </SelectField>
          <div className="form-component">
            <DateInputField
              label="Date Input"
              name="dueDate"
              minDate={new Date()}
              maxDate={
                new Date(new Date().setFullYear(new Date().getFullYear() + 10))
              }
            />
          </div>
          <div className="form-component">
            <CheckboxField label="Checkbox" checked={true} />
          </div>
          <div className="form-component">
            <TextareaField label="Textarea" placeholder="Enter notes..." />
          </div>
          <div className="form-component">
            <EditableTextField label="Editable Text" placeholder="Enter new text..." />
          </div>
          <div className="form-component" />
        </div>
      </div>
    )
  }
}

export default reduxForm({
  form: 'demoForm'
})(FormComponentsDemo)
