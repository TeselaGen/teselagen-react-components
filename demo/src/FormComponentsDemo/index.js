import React from 'react'
import { reduxForm } from 'redux-form'
import {
  InputField,
  SelectField,
  DateInputField,
  CheckboxField,
  TextareaField,
  EditableTextField,
  ReactSelectField,
  NumericInputField,
  RadioField
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
          <NumericInputField label="Volume" name="volume" />
        </div>
        <div className="form-component">
          <InputField label="Type" name="aliquotType" />
        </div>
        <div className="form-component">
          <SelectField label="select" name="source" disabled={false}>
            <option value="1">One</option>
            <option value="2">Two</option>
          </SelectField>
          <div className="form-component">
            <DateInputField
              label="Due Date"
              name="dueDate"
              minDate={new Date()}
              maxDate={
                new Date(new Date().setFullYear(new Date().getFullYear() + 10))
              }
            />
          </div>
          <div className="form-component">
            <CheckboxField label="Valid Aliquot" checked={false} />
          </div>
          <div className="form-component">
            <TextareaField label="notes" placeholder="Enter notes..." />
          </div>
          <div className="form-component">
            <EditableTextField name="name" placeholder="Workflow name..." />
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
