import React from 'react'
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
} from '../../../src/BlueprintReduxFormComponents'

export default class BlueprintReduxFormComponentsDemo extends React.Component {
  render() {
    return (
      <div>
        <form>
          <h1>Blueprint Redux Form Components</h1>
          <NumericInputField label="Volume" name="volume" />
          <InputField label="Type" name="aliquotType" />
          <SelectField name="source" disabled={false}>
            <option value="1">One</option>
            <option value="2">Two</option>
          </SelectField>
          <DateInputField
            label="Due Date"
            name="dueDate"
            minDate={new Date()}
            maxDate={
              new Date(new Date().setFullYear(new Date().getFullYear() + 10))
            }
          />
          <CheckboxField label="Valid Aliquot" checked={false} />
          <TextareaField label="notes" placeholder="Enter notes..." />
          <EditableTextField name="name" placeholder="Workflow name..." />
          <ReactSelectField />
          <RadioField />
        </form>
      </div>
    )
  }
}
