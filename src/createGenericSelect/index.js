import { Button, Intent, Tooltip, FormGroup, Classes } from "@blueprintjs/core";
import { get, isEqual, map, noop, pick, debounce, keyBy } from "lodash";
import pluralize from "pluralize";
import { Query } from "react-apollo";
import React, { Component } from "react";
import { compose } from "react-apollo";
import { connect } from "react-redux";
import { withQuery } from "@teselagen/apollo-methods";
import { branch, withProps } from "recompose";
import { change, clearFields, reduxForm } from "redux-form";
import ReactSelect from "react-select";
import moment from "moment";
import generateQuery from "../utils/generateQuery";
import BlueprintError from "../BlueprintError";
import DialogFooter from "../DialogFooter";
import withField from "../enhancers/withField";
import withDialog from "../enhancers/withDialog";
import withTableParams from "../DataTable/utils/withTableParams";
import DataTable from "../DataTable";

function preventBubble(e) {
  e.stopPropagation();
}

export default ({ modelNameToReadableName, withQueryAsFn, safeQuery }) => {
  return compose(
    // useage example:
    // <GenericSelect {...{
    //   name: "selectedWorklists", //the field name within the redux form Field
    //   isMultiSelect: true,
    //   schema: ["name", "lastModified"],
    //   fragment: worklistMinimalFragment,
    //   additionalDataFragment: worklistFragment,
    // }}/>

    // if you want initialValues, simply pass them to the reduxForm wrapped component like:
    // {
    //   initialValues: {
    //     selectedWorklists: [{id: 1, name: "worklist1"}]
    //   }
    // }

    //options:
    // name - the field name of the redux form Field!
    // schema - the schema for the data table
    // getButtonText(selectedEntities) - function to override the button text if necessary
    // isMultiSelect=false - do you want users to be able to select multiple entities or just one
    // noDialog=false - set to true to not have the selector show up in a dialog
    // noRemoveButton=false - set to true to not have the option to remove the selection
    // fragment - the fragment powering the lookup/datatable
    // dialogProps - any dialog overrides you might want to make
    // additionalDataFragment - optional fragment for fetching more data based on the initially selected data
    // postSelectDTProps - props passed to the DataTable shown after select. If none are passed the DataTable isn't shown
    // onSelect - optional callback for doing things with the selected data
    //
    // ################################   asReactSelect   ################################
    // idAs="id" - use this to get the react select to use some other property as the "value" aka idAs="code" for code based selects
    // asReactSelect - optionally make the generic select a simple react-select component instead of the default datatables
    // reactSelectProps - optionally pass additional props to the react select (https://github.com/JedWatson/react-select/blob/v1.x/README.md)
    // ** preventing unselect if you don't want a certain option to be unselected ever, you can pass initialValues with a property called clearableValue  entity.clearableValue,
    branch(
      props => props.noForm,
      reduxForm({
        form: "genericSelect",
        asyncBlurFields: [] //hacky fix for weird redux form asyncValidate error https://github.com/erikras/redux-form/issues/1675
      })
    ),
    withProps(({ name, asReactSelect, idAs }) => ({
      passedName: name,
      isCodeModel: idAs === "code",
      ...(asReactSelect && { noDialog: true })
    })),
    withProps(
      ({
        fragment,
        nameOverride,
        isMultiSelect,
        schema,
        dialogProps,
        passedName
      }) => {
        const modelName = Array.isArray(fragment)
          ? fragment[0]
          : get(fragment, "definitions[0].typeCondition.name.value");
        const readableName =
          nameOverride ||
          modelNameToReadableName(modelName, {
            plural: isMultiSelect,
            upperCase: true
          });
        return {
          readableName,
          modelName,
          postSelectFormName: passedName + "PostSelect",
          schema: !schema.model
            ? {
                model: modelName,
                fields: schema
              }
            : schema,
          dialogProps: {
            title: "Select " + readableName,
            ...dialogProps
          }
        };
      }
    ),
    withField(),
    connect(
      null,
      dispatch => {
        return {
          changeFieldValue: (...args) => dispatch(change(...args)),
          clearFields: (...args) => dispatch(clearFields(...args))
        };
      }
    )
  )(
    class GenericSelectOuter extends React.Component {
      state = {
        fetchingData: false,
        tempValue: null
      };

      static defaultProps = {
        input: {},
        meta: {}
      };

      resetPostSelectSelection = () => {
        const {
          postSelectFormName,
          postSelectDTProps = {},
          changeFieldValue
        } = this.props;
        const postSelectDTFormName =
          postSelectDTProps.formName || postSelectFormName;
        if (postSelectDTFormName) {
          changeFieldValue(
            postSelectDTFormName,
            "reduxFormSelectedEntityIdMap",
            {}
          );
        }
      };

      removeEntityFromSelection = record => {
        const {
          input: { onChange, value = [] }
        } = this.props;
        const newValue = value.filter(r => r.id !== record.id);
        if (newValue.length) {
          onChange(newValue);
          this.setState({
            tempValue: null
          });
          this.resetPostSelectSelection();
        } else {
          this.removeSelection();
        }
      };

      removeSelection = () => {
        const {
          meta: { form },
          input: { name },
          clearFields,
          onClear = noop
        } = this.props;
        clearFields(form, true, true, name);
        onClear();
        this.setState({
          tempValue: null
        });
        this.resetPostSelectSelection();
      };

      handleOnChange = newValue => {
        const {
          input: { onChange = noop, value = [] },
          isMultiSelect,
          preserveValue
        } = this.props;
        let toSelect = newValue;
        if (isMultiSelect && value.length && preserveValue) {
          const newIds = newValue.map(r => r.id);
          toSelect = value.filter(r => !newIds.includes(r.id)).concat(newValue);
        }
        onChange(toSelect);
      };

      handleSelection = async records => {
        const {
          additionalDataFragment,
          readableName,
          asReactSelect,
          onSelect,
          isMultiSelect,
          postSelectDTProps,
          isCodeModel
        } = this.props;
        const toSelect = isMultiSelect ? records : records[0];
        this.resetPostSelectSelection();
        if (asReactSelect && !records.length) {
          return this.removeSelection();
        }
        if (!additionalDataFragment) {
          onSelect && onSelect(toSelect);
          this.handleOnChange(toSelect || null);
          return;
        }

        this.setState({
          fetchingData: true
        });
        const queryVariables = {
          filter: {
            [isCodeModel ? "code" : "id"]: isMultiSelect
              ? records.map(({ id, code }) => (isCodeModel ? code : id))
              : isCodeModel
              ? records[0].code
              : records[0].id
          }
        };
        if (!postSelectDTProps) {
          try {
            let records;
            if (safeQuery) {
              records = await safeQuery(additionalDataFragment, {
                variables: queryVariables
              });
            } else {
              records = await withQueryAsFn(additionalDataFragment, {
                isPlural: true
              })(queryVariables);
            }
            const toSelect = isMultiSelect ? records : records[0];
            onSelect && onSelect(toSelect);
            this.handleOnChange(toSelect);
          } catch (error) {
            console.error("err:", error);
            window.toastr.error("Error fetching " + readableName);
          }
        } else if (!additionalDataFragment) {
          this.handleOnChange(toSelect);
        } else {
          // this is necessary because sometimes we are relying on the field to have
          // the full data
          this.setState({
            tempValue: toSelect
          });
        }
        this.setState({
          fetchingData: false
        });
      };
      render() {
        const { fetchingData, tempValue } = this.state;
        const {
          input: { value },
          meta: { error, touched },
          readableName,
          noDialog,
          postSelectFormName,
          getButtonText,
          noRemoveButton,
          getButton,
          postSelectDTProps,
          withSelectedTitle,
          additionalDataFragment,
          buttonProps = {},
          isMultiSelect,
          onSelect,
          noForm
        } = this.props;
        const postSelectValueToUse = tempValue || value;
        let postSelectDataTableValue = postSelectValueToUse;
        if (
          postSelectDataTableValue &&
          !Array.isArray(postSelectDataTableValue)
        ) {
          postSelectDataTableValue = [postSelectDataTableValue];
        }
        /* eslint-disable no-debugger*/
        if (postSelectDTProps && !postSelectDTProps.schema) debugger;
        /* eslint-enable no-debugger*/
        const propsToPass = {
          ...this.props,
          handleSelection: this.handleSelection
        };

        return noDialog ? (
          <div className="tg-generic-select-container" onClick={preventBubble}>
            <GenericSelectInner {...propsToPass} />
            <div>{touched && error && <BlueprintError error={error} />}</div>
          </div>
        ) : (
          <div className="tg-generic-select-container">
            <div
              onClick={preventBubble}
              style={{ paddingTop: 10, paddingBottom: 10 }}
            >
              <div style={{ display: "flex" }}>
                <GenericSelectInner {...propsToPass}>
                  {getButton ? (
                    getButton(value, propsToPass, this.state)
                  ) : (
                    <Button
                      intent={value ? Intent.NONE : Intent.PRIMARY}
                      text={
                        getButtonText
                          ? getButtonText(value)
                          : value
                          ? "Change " + readableName
                          : `Select ${readableName}`
                      }
                      {...buttonProps}
                      loading={fetchingData || buttonProps.loading}
                    />
                  )}
                </GenericSelectInner>
                {value && !noRemoveButton && !noForm && (
                  <Tooltip
                    disabled={buttonProps.disabled}
                    content={"Clear " + readableName}
                  >
                    <Button
                      minimal
                      style={{ marginLeft: 4 }}
                      intent={Intent.DANGER}
                      disabled={buttonProps.disabled}
                      onClick={this.removeSelection}
                      icon="trash"
                    />
                  </Tooltip>
                )}
              </div>
              {postSelectDTProps &&
                postSelectDataTableValue &&
                !!postSelectDataTableValue.length && (
                  <PostSelectTable
                    {...{
                      additionalDataFragment,
                      initialEntities: postSelectDataTableValue,
                      genericSelectValue: value,
                      onSelect,
                      withSelectedTitle,
                      readableName,
                      removeSelection: this.removeSelection,
                      removeEntityFromSelection: this.removeEntityFromSelection,
                      postSelectFormName,
                      postSelectDTProps,
                      isMultiSelect,
                      resetSelection: this.resetPostSelectSelection,
                      changeGenericSelectValue: this.handleOnChange,
                      buttonProps
                    }}
                  />
                )}
            </div>
            <div>{touched && error && <BlueprintError error={error} />}</div>
          </div>
        );
      }
    }
  );
};

const PostSelectTable = branch(
  ({ additionalDataFragment }) => !!additionalDataFragment,
  function WithQueryHOC(WrappedComponent) {
    return class WithLoadingComp extends React.Component {
      render() {
        const {
          additionalDataFragment,
          isMultiSelect,
          initialEntities
        } = this.props;

        const gqlQuery = generateQuery(additionalDataFragment, {
          isPlural: true
        });

        return (
          <Query
            variables={{
              filter: {
                id: isMultiSelect
                  ? initialEntities.map(({ id }) => id)
                  : initialEntities[0].id
              }
            }}
            query={gqlQuery}
          >
            {({ loading, error, data }) => {
              const modelName = Array.isArray(additionalDataFragment)
                ? additionalDataFragment[0]
                : get(
                    additionalDataFragment,
                    "definitions[0].typeCondition.name.value"
                  );
              const entities = get(data, pluralize(modelName) + ".results", []);
              return (
                <WrappedComponent
                  {...{
                    ...this.props,
                    error,
                    loading: loading || data.loading,
                    entities
                  }}
                />
              );
            }}
          </Query>
        );
      }
    };
  }
)(
  class PostSelectTableInner extends Component {
    componentDidMount() {
      this.componentDidMountOrUpdate();
    }

    componentDidUpdate(prevProps) {
      this.componentDidMountOrUpdate(prevProps);
    }

    componentDidMountOrUpdate(prevProps) {
      if (!this.props.entities) return;
      const {
        isMultiSelect,
        changeGenericSelectValue,
        entities,
        genericSelectValue,
        onSelect = noop
      } = this.props;
      const hasValue = isMultiSelect
        ? genericSelectValue && genericSelectValue.length
        : genericSelectValue;
      const prevEntitiesEqual =
        prevProps && isEqual(prevProps.entities, entities);
      if ((!prevEntitiesEqual || !hasValue) && entities.length) {
        const toSelect = isMultiSelect ? entities : entities[0];
        changeGenericSelectValue(toSelect);
        onSelect(toSelect);
      }
    }

    removeColumn = {
      width: 50,
      noEllipsis: true,
      immovable: true,
      type: "action",
      render: (v, record) => {
        return (
          <Button
            small
            minimal
            onClick={e => {
              e.stopPropagation();
              this.removeRecord(record);
            }}
            icon="trash"
            intent="danger"
          />
        );
      }
    };

    removeRecord = record => {
      const {
        isMultiSelect,
        removeSelection,
        removeEntityFromSelection
      } = this.props;
      if (isMultiSelect) {
        removeEntityFromSelection(record);
      } else {
        removeSelection();
      }
    };

    render() {
      const {
        initialEntities,
        withSelectedTitle,
        readableName,
        loading,
        entities,
        postSelectFormName,
        postSelectDTProps,
        noRemoveButton,
        buttonProps = {}
      } = this.props;

      let schemaToUse = postSelectDTProps.schema || [];
      if (!noRemoveButton && !buttonProps.disabled) {
        if (Array.isArray(schemaToUse)) {
          schemaToUse = [...schemaToUse, this.removeColumn];
        } else {
          schemaToUse = {
            ...schemaToUse,
            fields: [...schemaToUse.fields, this.removeColumn]
          };
        }
      }

      return (
        <div className="postSelectDataTable" style={{ paddingTop: 10 }}>
          {withSelectedTitle && <h6>Selected {readableName}:</h6>}
          <DataTable
            formName={postSelectFormName}
            doNotShowEmptyRows
            maxHeight={400}
            {...postSelectDTProps}
            schema={schemaToUse}
            // destroyOnUnmount={false}
            // keepDirtyOnReinitialize
            // enableReinitialize={true}
            // updateUnregisteredFields
            isLoading={loading}
            entities={entities || initialEntities}
          />
        </div>
      );
    }
  }
);

const GenericSelectInner = compose(
  branch(
    ({ noDialog }) => !noDialog,
    withDialog({
      enforceFocus: false,
      canOutsideClickClose: false
    })
  )
)(
  class GenericSelect extends Component {
    constructor(props) {
      super(props);
      this.getInnerComponent();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
      const propsToPick = [
        "fragment",
        "passedName",
        "queryOptions",
        "tableParamOptions"
      ];
      if (
        !isEqual(pick(this.props, propsToPick), pick(newProps, propsToPick))
      ) {
        this.getInnerComponent();
      }
    }

    getInnerComponent = () => {
      const {
        fragment,
        passedName,
        queryOptions,
        tableParamOptions,
        isCodeModel
      } = this.props;
      this.innerComponent = compose(
        withTableParams({
          formName: passedName + "DataTable",
          withSelectedEntities: true,
          noOrderError: true,
          doNotCoercePageSize: true,
          defaults: {
            order: ["-modified"]
          },
          ...tableParamOptions
        }),
        withQuery(fragment, {
          isPlural: true,
          options: queryOptions,
          isCodeModel
        })
      )(InnerComp);
    };

    render() {
      const { label } = this.props;
      const ComponentToRender = this.innerComponent;

      let comp = <ComponentToRender {...this.props} />;
      if (label) {
        return <FormGroup label={label}>{comp}</FormGroup>;
      } else {
        return comp;
      }
    }
  }
);

class InnerComp extends Component {
  onDoubleClick = record => {
    const { hideModal, handleSelection, isMultiSelect } = this.props;
    if (isMultiSelect) return;
    hideModal && hideModal();
    handleSelection([record]);
  };
  makeSelection = () => {
    const { hideModal, handleSelection, selectedEntities } = this.props;
    handleSelection(selectedEntities);
    hideModal && hideModal();
  };
  reactSelectHandleLoadMore = () => {
    const { setPageSize, currentParams, defaults } = this.props.tableParams;
    setPageSize((currentParams.pageSize || defaults.pageSize) + 25);
  };
  getReactSelectOptions = () => {
    const { tableParams, input, idAs, additionalOptions = [] } = this.props;
    const { entityCount, schema } = tableParams;

    const entities = [
      ...map({
        ...keyBy(tableParams.entities, idAs || "id"),
        //it is important that we spread these second so that things like clearableValue will work
        ...(input.value &&
          keyBy(
            Array.isArray(input.value) ? input.value : [input.value],
            idAs || "id"
          ))
      })
    ];
    if (!entities) return [];
    const lastItem = [];
    if (entityCount > (tableParams.entities || []).length) {
      lastItem.push({
        reactSelectHandleLoadMore: this.reactSelectHandleLoadMore,
        value: "__LOAD_MORE",
        label: (
          <span className={Classes.TEXT_MUTED} style={{ fontStyle: "italic" }}>
            Showing {entities.length} of{" "}
            {entityCount +
              additionalOptions.length +
              entities.length -
              (tableParams.entities || []).length}{" "}
            (Click to load more)
          </span>
        )
      });
    }

    const entityOptions = entities.map(entity => {
      return {
        clearableValue: entity.clearableValue,
        value: entity[idAs || "id"],
        label: (
          <span
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            {schema.fields.reduce((acc, field, i) => {
              const label = field.displayName ? (
                <span
                  className="tg-value-hide"
                  style={{ fontSize: 10, color: "#aaa" }}
                >
                  {field.displayName}:{" "}
                </span>
              ) : null;
              let val = get(entity, field.path || field);
              if (field.render) {
                val = field.render(val, entity, undefined, {
                  ...this.props,
                  ...this.props.additionalTableProps
                });
              } else if (field.type === "timestamp") {
                val = val ? moment(val).format("lll") : "";
              } else if (field.type === "boolean") {
                val = val ? "True" : "False";
              }

              let style;
              if (i > 0) {
                style = {
                  marginLeft: 8,
                  fontSize: 8
                };
              }
              acc.push(
                <span key={i} style={style}>
                  {label} {val}
                </span>
              );
              return acc;
            }, [])}
          </span>
        )
      };
    });
    return [...additionalOptions, ...entityOptions, ...lastItem];
  };
  handleReactSelectSearchDebounced = debounce(val => {
    this.props.tableParams.setSearchTerm(val);
  }, 250);
  handleReactSelectSearch = val => {
    this.handleReactSelectSearchDebounced(val);
    return val; //return val for react-select to work properly
  };
  handleReactSelectFieldSubmit = valOrVals => {
    const {
      handleSelection,
      input,
      tableParams,
      additionalOptions,
      idAs
    } = this.props;
    let entitiesById = keyBy(
      [...tableParams.entities, ...additionalOptions],
      idAs || "id"
    );
    if (input.value) {
      if (Array.isArray(input.value)) {
        entitiesById = {
          ...entitiesById,
          ...keyBy(input.value, idAs || "id")
        };
      } else {
        entitiesById[input.value[idAs || "id"]] = input.value;
      }
    }
    if (!valOrVals) {
      handleSelection([]);
    } else {
      const records = (Array.isArray(valOrVals) ? valOrVals : [valOrVals]).map(
        ({ value }) => {
          return entitiesById[value];
        }
      );
      handleSelection(records);
    }
  };

  render() {
    const {
      tableParams,
      hideModal,
      selectedEntities,
      isMultiSelect,
      additionalTableProps,
      readableName,
      minSelected,
      mustSelect,
      reactSelectProps,
      passedName,
      input,
      idAs,
      asReactSelect
    } = this.props;
    let disableButton = !selectedEntities.length;
    let minSelectMessage;
    let mustSelectMessage;
    if (minSelected && selectedEntities.length < minSelected) {
      minSelectMessage = `Please select at least ${minSelected} ${pluralize(
        readableName
      )}`;
      disableButton = true;
    }
    if (mustSelect && selectedEntities.length !== mustSelect) {
      mustSelectMessage = `Please select ${mustSelect} ${pluralize(
        readableName
      )}`;
      disableButton = true;
    }

    if (asReactSelect) {
      const value = isMultiSelect
        ? !input.value || !input.value.length
          ? ""
          : input.value.map(entity => {
              return entity[idAs || "id"];
            })
        : !input.value
        ? ""
        : input.value[idAs || "id"];
      return (
        <ReactSelect
          filterOptions={(options, filter, currentValues) => {
            // just filter out the selected options (the search will do the rest of the filtering for us)
            const currentValuesByKey = keyBy(currentValues, "value");
            return options.filter(({ value }) => {
              return !currentValuesByKey[value];
            });
            // return options
          }}
          value={value}
          isLoading={tableParams.isLoading}
          onSelectResetsInput={false}
          multi={isMultiSelect}
          closeOnSelect={!isMultiSelect}
          autoBlur={false}
          closeMenuOnSelect={false}
          onChange={this.handleReactSelectFieldSubmit}
          optionComponent={OptionOverride}
          options={this.getReactSelectOptions()}
          onInputChange={this.handleReactSelectSearch}
          name={passedName}
          {...reactSelectProps}
        />
      );
    }
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          {minSelectMessage}
          {mustSelectMessage}
        </div>
        <DataTable
          withSearch
          withPaging
          doNotShowEmptyRows
          onDoubleClick={this.onDoubleClick}
          withCheckboxes={isMultiSelect}
          isSingleSelect={!isMultiSelect}
          maxHeight={400}
          {...tableParams}
          {...additionalTableProps}
          // destroyOnUnmount={false}
          // keepDirtyOnReinitialize
          // enableReinitialize={true}
          // updateUnregisteredFields
        />
        <DialogFooter
          hideModal={hideModal}
          disabled={disableButton}
          onClick={this.makeSelection}
          text={
            "Select " +
            (selectedEntities.length > 1
              ? pluralize(readableName)
              : readableName)
          }
        />
      </div>
    );
  }
}

class OptionOverride extends React.Component {
  node = React.createRef();
  componentDidMount() {
    this.node.current.ontouchstart = this.preventPropagation;
    this.node.current.touchstart = this.preventPropagation;
    this.node.current.onmousedown = this.handleMouseDown;
    this.node.current.mousedown = this.handleMouseDown;
  }
  preventPropagation = event => {
    event.preventDefault();
    event.stopPropagation();
  };
  handleMouseDown = event => {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.option.value === "__LOAD_MORE") {
      this.props.option.reactSelectHandleLoadMore &&
        this.props.option.reactSelectHandleLoadMore();
      return;
    }
    this.props.onSelect(this.props.option, event);
  };
  handleMouseEnter = event => {
    this.props.onFocus(this.props.option, event);
  };
  handleMouseMove = event => {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  };
  render() {
    return (
      <div
        className={this.props.className}
        onBlur={this.preventPropagation}
        onClick={this.preventPropagation}
        ref={this.node}
        onMouseUp={this.preventPropagation}
        onTouchStart={this.preventPropagation}
        onTouchStartCapture={this.preventPropagation}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        title={this.props.option.title}
      >
        {this.props.children}
      </div>
    );
  }
}
