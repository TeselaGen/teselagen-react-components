// TypeScript Version: 2.5

import { Component } from "react";

export interface FormComponentProps {
  defaultValue: any,
  onFieldSubmit: Function,
  label: String,
  enableReinitialize: Boolean,
  tooltipProps: String,
  tooltipError: String,
  className: String,
  showErrorIfUntouched: Boolean,
  noOuterLabel: Boolean,
}

export class InputField extends Component<FormComponentProps>{}
export class NumericInputField extends Component<FormComponentProps>{}
export class RadioGroupField extends Component<FormComponentProps>{}
export class CheckboxField extends Component<FormComponentProps>{}
export class TextareaField extends Component<FormComponentProps>{}
export class SwitchField extends Component<FormComponentProps>{}
export class DateInputField extends Component<FormComponentProps>{}
export class SelectField extends Component<FormComponentProps>{}
export class DateRangeInputField extends Component<FormComponentProps>{}
export class EditableTextField extends Component<FormComponentProps>{}
export class ReactSelectField extends Component<FormComponentProps>{}
export class FileUploadField extends Component<FormComponentProps>{}