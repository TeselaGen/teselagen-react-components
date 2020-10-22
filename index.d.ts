/* eslint-disable no-unreachable*/

import * as React from "react";
import * as Blueprint from "@blueprintjs/core";
import { Intent, Button, Classes } from "@blueprintjs/core";
import { noop } from "lodash";

/*~ If this module has methods, export them as functions like so.
 */

export function noop(): void;

interface showDialogOnDocBodyOptions {
  /**
   *  * @property {boolean} addDialogContainer - add a dialog to this
   */
  addDialogContainer: false;
}
export function showDialogOnDocBody(
  DialogComp,
  showDialogOnDocBodyOptions
): void;

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

export global {
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

// /*~ You can export types that are available via importing the module */
// export interface SomeType {
//   name: string;
//   length: number;
//   extras?: string[];
// }

// /*~ You can export properties of the module using const, let, or var */
// export const myField: number;

// /*~ If there are types, properties, or methods inside dotted names
//  *~ of the module, export them inside a 'namespace'.
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

export class SimpleSelect extends React.Component<SimpleSelectProps, any> {}

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
export class AsyncValidateFieldSpinner extends React.Component<
  AsyncValidateFieldSpinnerProps,
  any
> {}

export interface AsyncValidateFieldSpinnerProps {
  validating?: boolean;
}

// BlueprintError
export class BlueprintError extends React.Component<
  BlueprintErrorProps,
  any
> {}

export interface BlueprintErrorProps {
  error: string;
}
// BounceLoader
export class BounceLoader extends React.Component<BounceLoaderProps, any> {}

export interface BounceLoaderProps {
  style: object;
  className: string;
}

/**
 * @example
 * <CollapsibleCard
        title="Additives"
        noCard
        openTitleElements={
          <ButtonGroup minimal>
            <Button
              text="Add Additives"
              icon="add"
              intent={Intent.SUCCESS}
              onClick={this.renderAddAdditivesDialog}
            />
          </ButtonGroup>
        }
      >
        <DataTable
          {...tableParams}
          className="additives-card"
          contextMenu={this.renderContextMenu}
        />
      </CollapsibleCard>
    @example
    <CollapsibleCard title="Replicate Aliquots" noCard>
      {aliquot.replicateAliquots && (
        <DataTable
          entities={aliquot.replicateAliquots}
          maxHeight={300}
          isSimple
          schema={schema}
          formName="replicateAliquotForm"
          onDoubleClick={routeDoubleClick}
        />
      )}
    </CollapsibleCard>
    const schema = {
      model: "defaultPositions",
      fields: [
        {
          displayName: "Name",
          path: "name"
        },
        {
          displayName: "Label",
          path: "label"
        },
        {
          displayName: "Index",
          path: "index"
        }
      ]
    };
    const schema = [
      "name",
      {
        displayName: "Destination Plate Type",
        path: "containerArrayType"
      }
    ];
 */
export class CollapsibleCard extends React.Component<
  CollapsibleCardProps,
  any
> {}

export interface CollapsibleCardProps {
  noCard: boolean;
  title: string;
  icon: string;
  openTitleElements: boolean;
  initialClosed: boolean;
}

export class CmdCheckbox extends React.Component<CmdProps, any> {}
export class CmdSwitch extends React.Component<CmdProps, any> {}
export class CmdDiv extends React.Component<CmdProps, any> {}
export class CmdButton extends React.Component<CmdProps, any> {}

export interface CmdProps {
  name: string;
  prefix: string;
  cmd: function;
}
// DNALoader
export class DNALoader extends React.Component<DNALoaderProps, any> {}

export interface DNALoaderProps {
  style: object;
  className: string;
}

/**
 * @example
 * <DataTable
    formName="placementStrategyDescriptionTypes"
    entities={types}
    schema={schema}
    isSimple
    compact
  />
  @example
  <DataTable
    withCheckboxes={false}
    isSingleSelect
    isSimple
    formName="sequencesToSubmitTable"
    withSelectedEntitites
    schema={orderSequencesSchema}
    entities={sequencesToOrder}
  />
  @example
  <DataTable
    schema={[
      "name",
      "strain",
      {
        displayName: "Species",
        path: "species",
        render: v => <i>{v}</i>
      }
    ]}
    formName="strainMaterialsTable"
    entities={strainMaterialCompEntities}
    isSimple
    onDoubleClick={routeDoubleClick}
  />
 */
export class DataTable extends React.Component<DataTableProps, any> {}

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
  autoFocusSearch: boolean;
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

/**
 * @example
 * <DialogFooter
    text="Next"
    submitting={submitting}
    onClick={handleSubmit(onSubmit)}
  />
  @example
  <DialogFooter
    onBackClick={() => {}}
    hideModal={hideModal}
    submitting={submitting}
    onClick={handleSubmit(onSubmit)}
  />
 */
export function DialogFooter({
  hideModal = noop,
  loading,
  onBackClick,
  submitting,
  onClick = noop,
  secondaryAction,
  intent = Intent.PRIMARY,
  secondaryIntent,
  secondaryText = "Cancel",
  additionalButtons,
  className,
  secondaryClassName = "",
  text = "Submit",
  disabled,
  noCancel
}) {
  return "";
}



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
export class DownloadLink extends React.Component<DownloadLinkProps, any> {}

export interface DownloadLinkProps {
  getFileString: function;
  filename: string;
  fileString: string;
}
// FillWindow
export class FillWindow extends React.Component<FillWindowProps, any> {}

export interface FillWindowProps {
  containerStyle: string;
  style: string;
  styleOverrides: string;
  className: string;
  disabled: boolean;
  children: any;
}

/**
 * fieldRequired
 * @example
 * <Field
 *  name="someField"
 *  component="input"
 *  validate={fieldRequired}
 * />
 */
export function fieldRequired(value: string | Array): string | undefined;

export interface GenericFormFieldProps {
  name: string;
  isRequired: boolean;
  onFieldSubmit: function;
  leftEl: any;
  rightEl: any;
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
  asyncValidate: function;
  validateOnChange: boolean;
  touchOnChange: boolean;
}

// BPSelect

// InputField
/**
 * @example
 * <InputField label="Search" isRequired name="searchQuery"></InputField>
 */
export class InputField extends React.Component<InputFieldProps, any> {}

export interface InputFieldProps extends GenericFormFieldProps {}

/**
 * @example
 * <FileUploadField
          name="alignmentToolSequenceUpload"
          innerText="Upload Sequences to Align (.ab1, .fasta, .gb)"
          accept={[".ab1", ".fasta", ".fa", ".gb", ".zip"]}
          style={{ maxWidth: 400 }}
          beforeUpload={async (files, onChange) => {...}}
        />
 * <FileUploadField accept={[".csv", ".xlsx"]} name="oligoFiles" />
 * <FileUploadField
          accept={[".csv", ".json", ".xlsx", ".zip"]}
          label="Upload Existing Design Template File Here"
          name="inputFiles"
          fileLimit={1}
        />
 */
export class FileUploadField extends React.Component<
  FileUploadFieldProps,
  any
> {}

export interface FileUploadFieldProps extends GenericFormFieldProps {
  innerIcon: "string";
  innerText: "string";
  threeDotMenuItems: any;
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

/**
 * @example
 * <DateInputField
              defaultValue={new Date()}
              label="Start Date"
              name="startDate"
              minDate={initialValues ? undefined : new Date()}
            />
 * <DateInputField
            name="serviceContractExpiration"
            label="Service Contract Expiration Date"
            minDate={new Date("1/1/2010")}
            maxDate={new Date("12/31/2100")}
          />
 */
export class DateInputField extends React.Component<
  DateInputFieldProps,
  any
> {}

export interface DateInputFieldProps extends GenericFormFieldProps {}
// DateRangeInputField
export class DateRangeInputField extends React.Component<
  DateRangeInputFieldProps,
  any
> {}

export interface DateRangeInputFieldProps extends GenericFormFieldProps {}
/**
 * @example 
 * <CheckboxField
              name={fieldPrefix + "shouldAssignToLocation"}
              label="Assign to Location"
              defaultValue
            />
 * <CheckboxField
              name="isInfinite"
              style={{ marginTop: 20 }}
              label="Set Infinite Capacity"
              defaultValue={false}
            />
            
 */
export class CheckboxField extends React.Component<CheckboxFieldProps, any> {}

export interface CheckboxFieldProps extends GenericFormFieldProps {}

/**
 * @example 
 * <SwitchField name="combineWorklists" label="Combine Worklists" />
 * <SwitchField
          label="Only Show Pending Worklists"
          name="onlyShowPending"
          defaultValue={true}
          onFieldSubmit={() => {
            setNewParams({
              ...currentParams,
              showAllWorklists: !currentParams.showAllWorklists
            });
          }}
        />
            
 */
export class SwitchField extends React.Component<SwitchFieldProps, any> {}

export interface SwitchFieldProps extends GenericFormFieldProps {}
/**
 * @example 
 * <TextareaField
        style={{ maxWidth: 400 }}
        placeholder="AGTTGAGC"
        name="sequence"
      />
 * <TextareaField
          name="description"
          label="Description"
          readOnly={!!design.isLocked}
          onFieldSubmit={this.handleFieldSubmit("description")}
        />         
 */
export class TextareaField extends React.Component<TextareaFieldProps, any> {}

export interface TextareaFieldProps extends GenericFormFieldProps {}
/**
 * @example 
 * <EditableTextField
    disabled={isUsedInWorkflowRun}
    placeholder="Input name..."
    name={"inputLabel.id" + id}
    onFieldSubmit={async v => {
      await safeUpsert(["workflowToolInputDefinition", "id label"], {
        id,
        label: v
      });
      this.props.triggerSaved();
    }}
  />       
  <EditableTextField
    name="name"
    onFieldSubmit={handleSubmit(this.onSubmit)}
    placeholder="Workflow Name..."
  />
 */
export class EditableTextField extends React.Component<
  EditableTextFieldProps,
  any
> {}

export interface EditableTextFieldProps extends GenericFormFieldProps {}
/**
 * @example 
 * <NumericInputField
    label="End Offset"
    name="partEndOffset"
    defaultValue={0}
    placeholder="600"
    disabled={!createPartsFromSequences}
  />
  <NumericInputField name="part.endBp" label="End BP" readOnly />
 */
export class NumericInputField extends React.Component<
  NumericInputFieldProps,
  any
> {}

export interface NumericInputFieldProps extends GenericFormFieldProps {}
/**
 * @example
 * <RadioGroupField
    name="format"
    label="Export as"
    options={[
      { label: "Genbank", value: "genbank" },
      { label: "Fasta", value: "fasta" }
    ]}
    defaultValue="genbank"
  />
  <RadioGroupField
    name="readOrientation"
    defaultValue="fr"
    options={[
      {
        label: "Forward / Reverse",
        value: "fr"
      },
      {
        label: "Reverse / Forward",
        value: "rf"
      },
      {
        label: "Forward / Forward",
        value: "ff"
      }
    ]}
  />
 */
export class RadioGroupField extends React.Component<
  RadioGroupFieldProps,
  any
> {}

export interface RadioGroupFieldProps extends GenericFormFieldProps {}

/**
 * @example
 * <SuggestField
    validate={validateNames}
    options={["taoh", "thomas", "tiff"]}
    name={`username`}
  />
 */
export class SuggestField extends React.Component<SuggestFieldProps, any> {}

export interface SuggestFieldProps extends GenericFormFieldProps {}

/**
 * @example
 * <ReactSelectField
    name="containerTypeCode"
    label="Container Type"
    placeholder="Select a container type"
    options={arrayToIdOrCodeValuedOptions(containerTypes)}
    disabled={!!initialValues.id}
    defaultValue={initialItemType}
    isRequired
    />
 */
export class ReactSelectField extends React.Component<
  ReactSelectFieldProps,
  any
> {}

export interface ReactSelectFieldProps extends GenericFormFieldProps {
  multi: boolean;
}
// SelectField
export class SelectField extends React.Component<SelectFieldProps, any> {}

export interface SelectFieldProps extends GenericFormFieldProps {}
/**
 * @example
 * <ReactColorField
    defaultValue="lightblue"
    label="Color"
    name="color"
  />
 */
export class ReactColorField extends React.Component<
  ReactColorFieldProps,
  any
> {}

export interface ReactColorFieldProps extends GenericFormFieldProps {}

// HotkeysDialog
export class HotkeysDialog extends React.Component<HotkeysDialogProps, any> {}

export interface HotkeysDialogProps {
  hotkeySets: object;
  isOpen: boolean;
  onClose: boolean;
}
/**
 * @example
 * <InfoHelper
    isInline
    color="darkgrey"
    icon="lock"
    onClick={() => {...}}
    content={
      <div>
        {lockedMessage}{" "}
        <div style={{ fontSize: 11, fontStyle: "italic" }}>
          {lockMsgDescription}
        </div>
      </div>
    }
  />
  <InfoHelper isButton disabled content={"Hey I'm some helpful info!"} />
  <InfoHelper isPopover content={"Hey I'm some helpful info!"} />
 */
export class InfoHelper extends React.Component<InfoHelperProps, any> {}

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
  displayToSide: boolean;
  style: object;
}
// IntentText
export class IntentText extends React.Component<IntentTextProps, any> {}

export interface IntentTextProps {
  intent: Blueprint.Intent;
  text: string;
  children: any;
}

// Loading
export class Loading extends React.Component<LoadingProps, any> {}

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
export class MenuBar extends React.Component<MenuBarProps, any> {}

export interface MenuBarProps {
  menu: any;
  enhancers: any;
  context: any;
  enhancers: any;
  menuSearchHotkey: any;
}
// // MultiSelectSideBySide
// export class MultiSelectSideBySide extends React.Component<MultiSelectSideBySideProps, any> { }

// export interface MultiSelectSideBySideProps {
//   selectedItems: array;
//   filteredItems: array;
//   loading: boolean;
//   messages: object;
//   onChange: func;
//   showSearch: boolean;
//   showSelectAll: boolean;
//   showSelectedItems: boolean;
//   searchIcon: string;
//   deleteIcon: string;
//   searchRenderer: func;
//   selectedItemRenderer: any;
//   height: number;
//   itemHeight: number;
//   selectAllHeight: number;
//   loaderRenderer: any;
//   maxSelectedItems: number;
// }

// ResizableDraggableDialog
export class ResizableDraggableDialog extends React.Component<
  ResizableDraggableDialogProps,
  any
> {}

export interface ResizableDraggableDialogProps {
  width: number;
  height: number;
  RndProps: object;
}
// ScrollToTop
export class ScrollToTop extends React.Component<ScrollToTopProps, any> {}

export interface ScrollToTopProps {
  showAt: number;
  scrollContainer: any;
}
// TgSelect
export class TgSelect extends React.Component<TgSelectProps, any> {}

export interface TgSelectProps {
  multi: boolean;
  options: any;
  value: any;
  /**
   * The tool uses a fuzzy search by default. This makes it use a simple indexOf search
   */
  isSimpleSearch: boolean;
  creatable: boolean;
  autoFocus: boolean;
  optionRenderer: any;
  tagInputProps: any;
  noResultsText: any;
  noResults: any;
  inputProps: any;
  placeholder: string;
  isLoading: boolean;
}
// Timeline
export class Timeline extends React.Component<TimelineProps, any> {}

export interface TimelineProps {
  children: any;
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
export function withSelectedEntities(tableName: string, tableName2: string);

/**
 *
 * @example
 * <Button
    onClick={async function handleClick() {
      const closeAppSpinner = showAppSpinner();
      setTimeout(() => {
        closeAppSpinner()
      }, 2000);
    }}
    text="Show the app spinner"
  />
 */
export function showAppSpinner();

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
export function showConfirmationDialog(showConfirmationDialogOpts): Promise;

interface showConfirmationDialogOpts {
  text: string;
  intent: string;
  confirmButtonText: string;
  cancelButtonText: string;
  canEscapeKeyCancel: boolean;
}

/**
 * This function allows you to override a schema with another schema
 */
export function mergeSchemas(schema, schemaOverrides) {
  return schema;
}

//Todo:

// constants
// customIcons
// enhancers
// rerenderOnWindowResize
// showConfirmationDialog
// style

export function getTagProps(){}
export function getTagsAndTagOptions(){}
export function getKeyedTagsAndTagOptions(){}