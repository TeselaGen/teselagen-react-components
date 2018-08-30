// TypeScript Version: 2.5

import { Component } from "react";
import {INumericInputProps, IRadioGroupProps, ICheckboxProps, IEditableTextProps, ISwitchProps} from '@blueprintjs/core';
import {IDateInputProps, IDateRangePickerProps} from '@blueprintjs/datetime';
import {BaseFieldProps} from 'redux-form';

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
  //redux form Props:
  name: string;
  format?: Formatter | null;
  normalize?: Normalizer;
  parse?: Parser;
  validate?: Validator | Validator[];
  warn?: Validator | Validator[];
  withRef?: boolean;
}
export interface NumericInputFieldProps extends FormComponentProps, INumericInputProps {}
export interface InputFieldProps extends FormComponentProps, IInputProps {}
export interface RadioGroupFieldProps extends FormComponentProps, IRadioGroupProps {}
export interface CheckboxFieldProps extends FormComponentProps, ICheckboxProps {}
export interface TextareaFieldProps extends FormComponentProps {}
export interface SwitchFieldProps extends FormComponentProps, ISwitchProps {}
export interface DateInputFieldProps extends FormComponentProps, IDateInputProps {}
export interface SelectFieldProps extends FormComponentProps, ISelectProps {}
export interface DateRangeInputFieldProps extends FormComponentProps, IDateRangePickerProps {}
export interface EditableTextFieldProps extends FormComponentProps, IEditableTextProps {}
export interface ReactSelectFieldProps extends FormComponentProps {}
export interface FileUploadFieldProps extends FormComponentProps {
  fileList: [fileList],
  action: string, //the url to upload to by default
  beforeUpload: function, //
  accept: string,
  contentOverride: jsx | string,
  innerIcon:  jsx | string,
  innerText:  jsx | string,
  className: string,
  fileLimit: number,
  readBeforeUpload: boolean,
  uploadInBulk: boolean,
  showUploadList: boolean,
  fileListItemRenderer: jsx,
  onFileSuccess: function,
  onFieldSubmit: function,
  onRemove: function,
  dropzoneProps: ReactDropZoneProps,
}
interface fileList {
  name,
  loading,
  error,
  url,
  originalName,
  downloadName
}

export class NumericInputField extends Component<NumericInputFieldProps>{}
export class InputField extends Component<InputFieldProps>{}
export class RadioGroupField extends Component<RadioGroupFieldProps>{}
export class CheckboxField extends Component<CheckboxFieldProps>{}
export class TextareaField extends Component<TextareaFieldProps>{}
export class SwitchField extends Component<SwitchFieldProps>{}
export class DateInputField extends Component<DateInputFieldProps>{}
export class SelectField extends Component<SelectFieldProps>{}
export class DateRangeInputField extends Component<DateRangeInputFieldProps>{}
export class EditableTextField extends Component<EditableTextFieldProps>{}
export class ReactSelectField extends Component<ReactSelectFieldProps>{}
export class FileUploadField extends Component<FileUploadFieldProps>{}