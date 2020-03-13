/* eslint-disable no-unreachable*/ 
import * as React from "react";
import * as Blueprint from "@blueprintjs/core";
/*~ If this module has methods, declare them as functions like so.
 */
interface WithUpsertOptions {
  /**
   * @property {string} mutationName - optional rename of the default upsert function withXXXX to whatever you want
   *
   */
  mutationName: string;
  /**
   * @property {[queryNameStrings]} refetchQueries -
   *
   */
  refetchQueries: [queryNameStrings];
  /**
   * @property {boolean} showError - default=true -- whether or not to show a default error message on failure
   *
   */
  showError: boolean;
  /**
   * @property {obj | function} extraMutateArgs - obj or function that
   * returns obj to get passed to the actual mutation call
   *
   */
  extraMutateArgs: obj | function;
  /**
   * @property {[string]} invalidate - array of model types to invalidate after the mutate
   *
   */
  invalidate: [string];
  /**
   * @property {boolean} asFunction - if true, this gives you back a function you can call directly instead of a HOC
   *
   */
  asFunction: boolean;
  /**
   * @property {string} idAs - if not using a fragment, you get an id
   * field back as default. But, if the record doesn't have an id field,
   * and instead has a 'code', you can set idAs: 'code'
   *
   */
  idAs: string;
  /**
   *  * @property {boolean} forceCreate - sometimes the thing you're creating
   *  won't have an id field (it might have a code or something else as its primary key).
   * This lets you override the default behavior of updating if no id is found
   *
   */
  forceCreate: boolean;
  /**
   *  * @property {boolean} forceUpdate - sometimes the thing you're updating might have
   * an id field. This lets you override that. This lets you override the default behavior of creating if an id is found
   *
   */
  forceUpdate: boolean;
  /**
   *  * @property {boolean} excludeResults - don't fetch back result entities after update or create
   */
  excludeResults: boolean;
}

export function withUpsert(
  nameOrFragment: string,
  options: WithUpsertOptions
): void;

//tnrtodo: we should really just re-export withquery etc from @teselagen/apollo-methods in 
export function withQuery(
  nameOrFragment: string,
  options: WithUpsertOptions
): void;

export function noop(): void;

interface showDialogOnDocBodyOptions {
  /**
   *  * @property {boolean} addDialogContainer - add a dialog to this
   */
  addDialogContainer: false
}
export function showDialogOnDocBody(DialogComp, showDialogOnDocBodyOptions): void;



/**
 * Note all these options can be passed at Design Time or at Runtime (like reduxForm())
 */
interface WithTableParamsOptions {
  /**
   * @property {*string} formName - required unique identifier for the table
   */
  formName: string;
  /**
   * @property The data table schema or a function returning it. The function wll be called with props as the argument.
   */
  schema: Object | Function;
  /**
   * @property whether the table should connect to/update the URL
   */
  urlConnected: boolean;
  /**
   * @property whether or not to pass the selected entities
   */
  withSelectedEntities: boolean;
  /**
   * @property whether the model is keyed by code instead of id in the db
   */
  isCodeModel: boolean;
  /**
   * @property tableParam defaults such as pageSize, filter, etc
   */
  defaults: object;
  /**
   * @property won't console an error if an order is not found on schema
   */
  noOrderError: boolean;
}

/**
 * Withs table params
 * @param options
 * @example
 * withTableParams({formName: "mySequenceTable"})
 */
export function withTableParams(options: WithTableParamsOptions): void;

interface ToastrFunc {
  /**
   * Fire a little toastr notification
   *
   * @example
   *    // they all work similarly
   *
   *    window.toastr.warning("Error")
   *    you can also chain them using a unique key
   *    window.toastr.info("Sequence Saving", {key: "seqSave"})
   *    window.toastr.success("Sequence Saved!", {key: "seqSave"})
   *    window.toastr.success("Sequence Saved!", {timeout: 10000}) //wait longer or shorter to clear the toast
   *    window.toastr.success("Sequence Saved!", {icon: "chat"})
   */
  (message: string, options: ToastrFuncOptions): void;
}

interface ToastrFuncOptions {
  icon: string;
  timeout: number;
  /**
   * defaults to false, set this only if you're also using a key option and you want to
   * have the timeout be refreshed
   */
  updateTimeout: boolean;
  /**
   * use a unique key to update the toastr
   */
  key: string;
}

declare global {
  interface Window {
    toastr: {
      success: ToastrFunc;
      error: ToastrFunc;
      warning: ToastrFunc;
      info: ToastrFunc;
      default: ToastrFunc;
    };
  }
}

// export function myOtherMethod(a: number): number;

// /*~ You can declare types that are available via importing the module */
// export interface SomeType {
//   name: string;
//   length: number;
//   extras?: string[];
// }

// /*~ You can declare properties of the module using const, let, or var */
// export const myField: number;

// /*~ If there are types, properties, or methods inside dotted names
//  *~ of the module, declare them inside a 'namespace'.
//  */
// export namespace subProp {
//   /*~ For example, given this definition, someone could write:
//      *~   import { subProp } from 'yourModule';
//      *~   subProp.foo();
//      *~ or
//      *~   import * as yourMod from 'yourModule';
// import { withTableParams } from "./index";
//      *~   yourMod.subProp.foo();
//      */
//   export function foo(): void;
// }


declare class SimpleSelect extends React.Component<SimpleSelectProps, any> { }

export interface SimpleSelectProps {
  autofocus?: boolean;
  cancelKeyboardEventOnSelection?: boolean;
  className?: string;
  createFromSearch?(items: OptionValue[], search: string): OptionValue;
  defaultValue?: OptionValue;
  delimiters?: [any];
  disabled?: boolean;
  // ...
}


// AsyncValidateFieldSpinner
declare class AsyncValidateFieldSpinner extends React.Component<AsyncValidateFieldSpinnerProps, any> { }

export interface AsyncValidateFieldSpinnerProps {
  validating?: boolean;
}

// BlueprintError
declare class BlueprintError extends React.Component<BlueprintErrorProps, any> { }

export interface BlueprintErrorProps {
  error: string;
}
// BounceLoader
declare class BounceLoader extends React.Component<BounceLoaderProps, any> { }

export interface BounceLoaderProps {
  style: object;
  className: string;
}

// CollapsibleCard
declare class CollapsibleCard extends React.Component<CollapsibleCardProps, any> { }

export interface CollapsibleCardProps {
  title: string;
  icon: string;
  openTitleElements: boolean;
  initialClosed: boolean;
}

declare class CmdCheckbox extends React.Component<CmdProps, any> { }
declare class CmdSwitch extends React.Component<CmdProps, any> { }
declare class CmdDiv extends React.Component<CmdProps, any> { }
declare class CmdButton extends React.Component<CmdProps, any> { }

export interface CmdProps {
  name: string;
  prefix: string;
  cmd: function;
}
// DNALoader
declare class DNALoader extends React.Component<DNALoaderProps, any> { }


export interface DNALoaderProps {
  style: object;
  className: string;
}
// DataTable
declare class DataTable extends React.Component<DataTableProps, any> { }

export interface DataTableProps {
  extraClasses: string;
  className: string;
  tableName: string;
  mustClickCheckboxToSelect: boolean;
  isLoading: boolean;
  searchTerm: string;
  noRowsFoundMessage: string;
  setSearchTerm: function;
  clearFilters: function;
  hidePageSizeWhenPossible: boolean;
  doNotShowEmptyRows: boolean;
  withTitle: boolean;
  withCheckboxes: boolean;
  withSearch: boolean;
  withPaging: boolean;
  isInfinite: boolean;
  disabled: boolean;
  noHeader: boolean;
  noFooter: boolean;
  noPadding: boolean;
  noFullscreenButton: boolean;
  withDisplayOptions: boolean;
  resized: boolean;
  resizePersist: boolean;
  updateColumnVisibility: function;
  updateTableDisplayDensity: function;
  syncDisplayOptionsToDb: boolean;
  resetDefaultVisibility: function;
  maxHeight: number;
  style: object;
  pageSize: number;
  formName: string;
  schema: object;
  filters: object;
  userSpecifiedCompact: boolean;
  hideDisplayOptionsIcon: boolean;
  /**
   * By deafult compact is true! To get the table to be "comfortable", set compact={false}
   */
  compact: boolean;
  extraCompact: boolean;
  compactPaging: boolean;
  entityCount: number;
  showCount: boolean;
  isSingleSelect: boolean;
  noSelect: boolean;
  SubComponent: any;
  shouldShowSubComponent: boolean;
  ReactTableProps: object;
  hideSelectedCount: boolean;
  hideColumnHeader: boolean;
  subHeader: any;
  isViewable: boolean;
  entities: any;
  children: any;
  topLeftItems: any;
  hasOptionForForcedHidden: boolean;
  showForcedHiddenColumns: boolean;
  searchMenuButton: any;
  setShowForcedHidden: function;

}
// DialogFooter
declare class DialogFooter extends React.Component<DialogFooterProps, any> { }

export interface DialogFooterProps {
  hideModal: function;
  loading: boolean;
  submitting: boolean;
  onClick: function;
  error: string;
  secondaryAction: function;
  intent: Blueprint.Intent;
  secondaryIntent: Blueprint.Intent;
  secondaryText: string;
  additionalButtons: any;
  className: string;
  secondaryClassName: string;
  text: string;
  disabled: boolean;
  noCancel: boolean;
}
// DownloadLink
declare class DownloadLink extends React.Component<DownloadLinkProps, any> { }

export interface DownloadLinkProps {
  getFileString: function;
  filename: string;
  fileString: string;
}
// FillWindow
declare class FillWindow extends React.Component<FillWindowProps, any> { }

export interface FillWindowProps {
  containerStyle: string;
  style: string;
  styleOverrides: string;
  className: string;
  disabled: boolean;
  children: any;
}

export interface GenericFormFieldProps {
  name: string;
  isRequired: boolean;
  onFieldSubmit: function;
  children: any;
  defaultValue: any;
  tooltipProps: any;
  tooltipError: any;
  disabled: boolean;
  intent: Blueprint.Intent;
  tooltipInfo: any;
  label: any;
  inlineLabel: any;
  secondaryLabel: any;
  className: string;
  showErrorIfUntouched: boolean;
  containerStyle: object;
  noOuterLabel: boolean;
  noFillField: boolean;
}

// BPSelect

// InputField
declare class InputField extends React.Component<InputFieldProps, any> { }

export interface InputFieldProps extends GenericFormFieldProps {

}
// FileUploadField
declare class FileUploadField extends React.Component<FileUploadFieldProps, any> { }

export interface FileUploadFieldProps extends GenericFormFieldProps {
  innerIcon: "string";
  innerText: "string";
  accept: string | array;
  contentOverride: function;
  action: string;
  className: string;
  fileLimit: integer;
  readBeforeUpload: boolean;
  showUploadList: boolean;
  fileListItemRenderer: function;
  onFileClick: function;
  dropzoneProps: object;
  showFilesCount: boolean;
  S3Params: object;
}
// DateInputField
declare class DateInputField extends React.Component<DateInputFieldProps, any> { }

export interface DateInputFieldProps extends GenericFormFieldProps {

}
// DateRangeInputField
declare class DateRangeInputField extends React.Component<DateRangeInputFieldProps, any> { }

export interface DateRangeInputFieldProps extends GenericFormFieldProps {

}
// CheckboxField
declare class CheckboxField extends React.Component<CheckboxFieldProps, any> { }

export interface CheckboxFieldProps extends GenericFormFieldProps {

}
// SwitchField
declare class SwitchField extends React.Component<SwitchFieldProps, any> { }

export interface SwitchFieldProps extends GenericFormFieldProps {

}
// TextareaField
declare class TextareaField extends React.Component<TextareaFieldProps, any> { }

export interface TextareaFieldProps extends GenericFormFieldProps {

}
// EditableTextField
declare class EditableTextField extends React.Component<EditableTextFieldProps, any> { }

export interface EditableTextFieldProps extends GenericFormFieldProps {

}
// NumericInputField
declare class NumericInputField extends React.Component<NumericInputFieldProps, any> { }

export interface NumericInputFieldProps extends GenericFormFieldProps {

}
// RadioGroupField
declare class RadioGroupField extends React.Component<RadioGroupFieldProps, any> { }

export interface RadioGroupFieldProps extends GenericFormFieldProps {

}
// ReactSelectField
declare class ReactSelectField extends React.Component<ReactSelectFieldProps, any> { }

export interface ReactSelectFieldProps extends GenericFormFieldProps {
  multi: boolean;
}
// SelectField
declare class SelectField extends React.Component<SelectFieldProps, any> { }

export interface SelectFieldProps extends GenericFormFieldProps {

}
// ReactColorField
declare class ReactColorField extends React.Component<ReactColorFieldProps, any> { }

export interface ReactColorFieldProps extends GenericFormFieldProps {

}

// HotkeysDialog
declare class HotkeysDialog extends React.Component<HotkeysDialogProps, any> { }

export interface HotkeysDialogProps {
  hotkeySets: object;
  isOpen: boolean;
  onClose: boolean;
}
// InfoHelper
declare class InfoHelper extends React.Component<InfoHelperProps, any> { }

export interface InfoHelperProps {
  className: string;
  content: any;
  children: any;
  icon: string;
  color: string;
  clickable: boolean;
  isPopover: boolean;
  isInline: boolean;
  isButton: boolean;
  size: integer;
  popoverProps: object;
  disabled: boolean;
  noPopoverSizing: boolean;
  displayToSide: boolean;
  style: object;
}
// IntentText
declare class IntentText extends React.Component<IntentTextProps, any> { }

export interface IntentTextProps {
  intent: Blueprint.Intent;
  text: string;
  children: any;
}
// J5ReportRecordView
declare class J5ReportRecordView extends React.Component<J5ReportRecordViewProps, any> { }

export interface J5ReportRecordViewProps {
  data: any;
  additionalHeaderButtons: any;
  LinkJ5TableDialog: any;
  LinkJ5ReportButton: any;
  additionalHeaderComponent: any;
  getSchema: any;
  data: any;
  getIsLinkedCellRenderer: any;
  LinkJ5TableDialog: any;
  LinkJ5ReportButton: any;
  onConstructDoubleClick: any;
  pcrReactionsTitleElements: any;
  constructsTitleElements: any;
  oligosTitleElements: any;
  linkDialogWidth: any;
  fragmentMap: any;
  linkFragmentMap: any;
  noPrebuiltConstructs: any;
  dataTableProps: any;
  synthonSequenceTitleElements: any;
}
// Loading
declare class Loading extends React.Component<LoadingProps, any> { }

export interface LoadingProps {
  loading: any;
  style: any;
  className: any;
  containerStyle: any;
  children: any;
  displayInstantly: any;
  bounce: any;
  withTimeout: any;
  inDialog: any;
}
// MenuBar
declare class MenuBar extends React.Component<MenuBarProps, any> { }

export interface MenuBarProps {
  menu: any;
  enhancers: any;
  context: any;
  enhancers: any;
  menuSearchHotkey: any;
}
// MultiSelectSideBySide
declare class MultiSelectSideBySide extends React.Component<MultiSelectSideBySideProps, any> { }

export interface MultiSelectSideBySideProps {
  selectedItems: array;
  filteredItems: array;
  loading: boolean;
  messages: object;
  onChange: func;
  showSearch: boolean;
  showSelectAll: boolean;
  showSelectedItems: boolean;
  searchIcon: string;
  deleteIcon: string;
  searchRenderer: func;
  selectedItemRenderer: any;
  height: number;
  itemHeight: number;
  selectAllHeight: number;
  loaderRenderer: any;
  maxSelectedItems: number;
}
// ResizableDraggableDialog
declare class ResizableDraggableDialog extends React.Component<ResizableDraggableDialogProps, any> { }

export interface ResizableDraggableDialogProps {
  width: number;
  height: number;
  RndProps: object;
}
// ScrollToTop
declare class ScrollToTop extends React.Component<ScrollToTopProps, any> { }

export interface ScrollToTopProps {
  showAt: number;
  scrollContainer: any;
}
// TgSelect
declare class TgSelect extends React.Component<TgSelectProps, any> { }

export interface TgSelectProps {
  multi: boolean;
  options: any;
  value: any;
  /**
   * The tool uses a fuzzy search by default. This makes it use a simple indexOf search
   */
  isSimpleSearch: boolean;
  creatable: boolean;
  optionRenderer: any;
  tagInputProps: any;
  noResultsText: any;
  noResults: any;
  inputProps: any;
  placeholder: string;
  isLoading: boolean;
}
// Timeline
declare class Timeline extends React.Component<TimelineProps, any> { }

export interface TimelineProps {
  children: any;
}
// Tree
declare class Tree extends React.Component<TreeProps, any> { }

export interface TreeProps {
  layout: string;
  cardIdKey: string;
  childrenKey: string;
  colorCodes: any;
  connectorThickness: number;
  horizontalLeaves: boolean;
  colorByDepth: boolean;
  includeMinimap: boolean;
  zoom: number;
  marginRight: number;
  marginBottom: number;
}


/**
 *
 * useage example:
 * <GenericSelect {...{
 *   name: "selectedWorklists" - the field name within the redux form Field
 *   isMultiSelect: true,
 *   schema: ["name", "lastModified"],
 *   fragment: worklistMinimalFragment,
 *   additionalDataFragment: worklistFragment,
 * }}/>

 * if you want initialValues, simply pass them to the reduxForm wrapped component like:
 * {
 *   initialValues: {
 *     selectedWorklists: [{id: 1, name: "worklist1"}]
 *   }
 * }

 *options:
 * name - the field name of the redux form Field!
 * schema - the schema for the data table
 * getButtonText(selectedEntities) - function to override the button text if necessary
 * isMultiSelect=false - do you want users to be able to select multiple entities or just one
 * noDialog=false - set to true to not have the selector show up in a dialog
 * noRemoveButton=false - set to true to not have the option to remove the selection
 * fragment - the fragment powering the lookup/datatable
 * dialogProps - any dialog overrides you might want to make
 * dialogFooterProps - any dialogFooter overrides you might want to make
 * additionalDataFragment - optional fragment for fetching more data based on the initially selected data
 * postSelectDTProps - props passed to the DataTable shown after select. If none are passed the DataTable isn't shown
 * onSelect - optional callback for doing things with the selected data
 *

 * ################################   asReactSelect   ################################
 * idAs="id" - use this to get the TgSelect to use some other property as the "value" aka idAs="code" for code based selects
 * asReactSelect - optionally make the generic select a simple TgSelect component instead of the default datatables
 * reactSelectProps - optionally pass additional props to the TgSelect
 * ** preventing unselect if you don't want a certain option to be unselected ever, you can pass initialValues with a property called clearableValue  entity.clearableValue,
 */
declare class GenericSelect extends React.Component<GenericSelectProps, any> { }


export interface GenericSelectProps {
  /**
   *  the field name of the redux form Field!
   */
  name
  /**
   *  the schema for the data table
   */
  schema
  /**
   * takes in (selectedEntities) function to override the button text if necessary
   */
  getButtonText
  /**
   * default=false do you want users to be able to select multiple entities or just one
   */
  isMultiSelect
  /**
   * default=false set to true to not have the selector show up in a dialog
   */
  noDialog
  /**
   * default=false set to true to not have the option to remove the selection
   */
  noRemoveButton
  /**
   *  the fragment powering the lookup/datatable
   */
  fragment
  /**
   *  any dialog overrides you might want to make
   */
  dialogProps
  /**
   *  any dialogFooter overrides you might want to make
   */
  dialogFooterProps
  /**
   *  optional fragment for fetching more data based on the initially selected data
   */
  additionalDataFragment
  /**
   *  props passed to the DataTable shown after select. If none are passed the DataTable isn't shown
   */
  postSelectDTProps
  /**
   *  optional callback for doing things with the selected data
   */
  onSelect
  /**
     * optionally make the generic select a simple TgSelect component instead of the default datatables
     */
  asReactSelect: boolean;
  /**
   * default="id" use this to get the TgSelect to use some other property as the "value" aka idAs="code" for code based selects
   */
  idAs: string;
  /**
   * optionally pass additional props to the TgSelect
   */
  reactSelectProps: reactSelectProps;
}

declare function createGenericSelect(options: CreateGenericSelectOptions) {
  return GenericSelect
}

/**
 *
 * @param {*string} formName
 * @param {*string} formName
 * @param {*string} formName
 * @param {*string} ...etc
 * @example
 * withSelectedEntities("sequenceTable")
 * //adds a new prop sequenceTableSelectedEntities 
 * //generically : `${formName}SelectedEntities` 
 */
declare function withSelectedEntities(tableName: string, tableName2: string)

/**
 *
 * @param {*string} formName
 * @param {*string} formName
 * @param {*string} formName
 * @param {*string} ...etc
 * @example
 * withSelectedEntities("sequenceTable")
 * //adds a new prop sequenceTableSelectedEntities 
 * //generically : `${formName}SelectedEntities` 
 */
declare function showLoadingMask(opts) {
  return closeLoadingMask
}

/**
 *
 * @example
 * const confirm = await showConfirmationDialog({
 *   text:
 *     selectedCount > 1
 *       ? `Are you sure you want to delete these custom icons?
 *           You cannot undo this action.`
 *       : `Are you sure you want to delete this custom icon?
 *           You cannot undo this action.`,
 *   intent: Intent.DANGER,
 *   confirmButtonText: "Delete",
 *   cancelButtonText: "Cancel",
 *   canEscapeKeyCancel: true
 * });
 * if (confirm) {
 * } 
 */
declare function showConfirmationDialog(showConfirmationDialogOpts):Promise

interface showConfirmationDialogOpts {
  text: string;
  intent: string;
  confirmButtonText: string;
  cancelButtonText: string;
  canEscapeKeyCancel: boolean;
}


function closeLoadingMask(){}

interface CreateGenericSelectOptions {
  /**
   * @property {function} modelNameToReadableName - a function that takes in a model name and spits out a human readable name
   *
   */
  modelNameToReadableName: function;
}
interface reactSelectProps {
  /**
   * allow the user to create new values
   */
  creatable: boolean;
}





//Todo: 
// createGenericSelect
// getApolloMethods

// constants
// customIcons
// enhancers
// flow_types
// rerenderOnWindowResize
// showConfirmationDialog
// showLoadingMask
// style