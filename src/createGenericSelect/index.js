import { Button, Intent, Tooltip } from "@blueprintjs/core";
import { get, isEqual, noop } from "lodash";
import pluralize from "pluralize";
import React, { Component } from "react";
import { compose } from "react-apollo";
import { connect } from "react-redux";
import { branch, withProps } from "recompose";
import { change, clearFields, reduxForm } from "redux-form";
import uniqid from "uniqid";
import { Query } from "react-apollo";
import DataTable from "../DataTable";
import withTableParams from "../DataTable/utils/withTableParams";
import withDialog from "../enhancers/withDialog";
import withField from "../enhancers/withField";
import withQuery from "../enhancers/withQuery";
import adHoc from "../utils/adHoc";
import DialogFooter from "../DialogFooter";
import BlueprintError from "../BlueprintError";
import generateFragmentWithFields from "../utils/generateFragmentWithFields";
import gql from "graphql-tag";

function preventBubble(e) {
  e.stopPropagation();
}
//
export default ({ modelNameToReadableName, withQueryAsFn }) => {
  return compose(
    // useage example:
    // <GenericSelect {...{
    //   name: "selectedWorklists", //the field name within the redux form Field
    //   isMultiSelect: true,
    //   schema: ["name", "lastModified"],
    //   fragment: worklistMinimalFragment,
    //   additionalDataFragment: worklistFragment,
    // }}/>

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
    branch(
      props => props.noForm,
      reduxForm({
        form: "genericSelect",
        asyncBlurFields: [] //hacky fix for weird redux form asyncValidate error https://github.com/erikras/redux-form/issues/1675
      })
    ),
    withProps(({ name }) => ({ passedName: name })),
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
    connect(null, dispatch => {
      return {
        changeFieldValue: (...args) => dispatch(change(...args)),
        clearFields: (...args) => dispatch(clearFields(...args))
      };
    })
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

      handleSelection = async records => {
        const {
          input: { onChange = noop },
          additionalDataFragment,
          readableName,
          onSelect,
          isMultiSelect,
          postSelectDTProps
        } = this.props;
        const toSelect = isMultiSelect ? records : records[0];
        if (!additionalDataFragment) {
          onSelect && onSelect(toSelect);
          onChange(toSelect);
          return;
        }

        this.setState({
          fetchingData: true
        });
        const queryFilter = {
          filter: {
            id: isMultiSelect ? records.map(({ id }) => id) : records[0].id
          }
        };
        if (!postSelectDTProps) {
          try {
            const records = await withQueryAsFn(additionalDataFragment, {
              isPlural: true
            })(queryFilter);
            const toSelect = isMultiSelect ? records : records[0];
            onSelect && onSelect(toSelect);
            onChange(toSelect);
            this.resetPostSelectSelection();
          } catch (error) {
            console.error("err:", error);
            window.toastr.error("Error fetching " + readableName);
          }
        } else if (!additionalDataFragment) {
          onChange(toSelect);
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
          input: { value, onChange = noop },
          meta: { error },
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
          <div onClick={preventBubble}>
            <GenericSelectInner {...propsToPass} />
            <div>{error && <BlueprintError error={error} />}</div>
          </div>
        ) : (
          <div>
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
                {value && !noRemoveButton &&
                  !noForm && (
                    <Tooltip
                      disabled={buttonProps.disabled}
                      content={"Clear " + readableName}
                    >
                      <Button
                        className={"pt-minimal"}
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
                      withSelectedTitle,
                      readableName,
                      postSelectFormName,
                      postSelectDTProps,
                      isMultiSelect,
                      resetSelection: this.resetPostSelectSelection,
                      changeGenericSelectValue: onChange
                    }}
                  />
                )}
            </div>
            <div>{error && <BlueprintError error={error} />}</div>
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

        let fragment = additionalDataFragment;
        if (Array.isArray(fragment)) {
          fragment = generateFragmentWithFields(...fragment);
        }
        if (typeof fragment === "string" || typeof fragment !== "object") {
          throw new Error(
            "Please provide a valid fragment when using withQuery!"
          );
        }
        const name = get(fragment, "definitions[0].typeCondition.name.value");
        if (!name) {
          console.error("Bad fragment passed to withQuery!!");
          // console.error(fragment, options);
          throw new Error(
            "No fragment name found in withQuery() call. This is due to passing in a string or something other than a gql fragment to withQuery"
          );
        }
        // const {fragment, extraMutateArgs} = options
        const fragName = fragment && fragment.definitions[0].name.value;
        const nameToUse = pluralize(name);
        const queryNameToUse = nameToUse + "Query";
        // const pascalNameToUse = pascalCase(nameToUse)
        let queryInner = `${fragName ? `...${fragName}` : "id"}`;
        if (true) {
          queryInner = `results {
      ${queryInner}
    }
    totalResults`;
        }

        let gqlQuery;
        if (true) {
          gqlQuery = gql`
      query ${queryNameToUse} ($pageSize: Int $sort: [String] $filter: JSON $pageNumber: Int) {
        ${nameToUse}(pageSize: $pageSize, sort: $sort, filter: $filter, pageNumber: $pageNumber) {
          ${queryInner}
        }
      }
      ${fragment ? fragment : ``}
    `;
        } else {
          gqlQuery = gql`
      query ${queryNameToUse} ($${false || "id"}: String!) {
        ${nameToUse}(${false || "id"}: $${false || "id"}) {
          ${queryInner}
        }
      }
      ${fragment ? fragment : ``}
    `;
        }

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
        genericSelectValue = []
      } = this.props;
      const hasValue = isMultiSelect
        ? genericSelectValue.length
        : genericSelectValue;
      const prevEntitiesEqual =
        prevProps && isEqual(prevProps.entities, entities);
      if ((!prevEntitiesEqual || !hasValue) && entities.length) {
        const toSelect = isMultiSelect ? entities : entities[0];
        changeGenericSelectValue(toSelect);
      }
    }

    render() {
      const {
        initialEntities,
        withSelectedTitle,
        readableName,
        loading,
        entities,
        postSelectFormName,
        postSelectDTProps
      } = this.props;
      return (
        <div className="postSelectDataTable" style={{ paddingTop: 10 }}>
          {withSelectedTitle && <h6>Selected {readableName}:</h6>}
          <DataTable
            formName={postSelectFormName}
            doNotShowEmptyRows
            maxHeight={400}
            {...postSelectDTProps}
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
  ),
  adHoc(props => {
    const { fragment, passedName, queryOptions } = props;
    return [
      withTableParams({
        formName: passedName + "DataTable",
        withSelectedEntities: true
      }),
      withQuery(fragment, { isPlural: true, options: queryOptions })
    ];
  })
)(
  class GenericSelect extends Component {
    onDoubleClick = record => {
      const { hideModal, handleSelection, isMultiSelect } = this.props;
      if (isMultiSelect) return;
      hideModal && hideModal();
      handleSelection([record]);
    };

    makeSelection = () => {
      const { hideModal, handleSelection, selectedEntities } = this.props;
      handleSelection(selectedEntities);
      hideModal();
    };

    render() {
      const {
        tableParams,
        hideModal,
        selectedEntities,
        isMultiSelect,
        readableName
      } = this.props;
      return (
        <div>
          <DataTable
            withSearch
            withPaging
            doNotShowEmptyRows
            onDoubleClick={this.onDoubleClick}
            withCheckboxes={isMultiSelect}
            isSingleSelect={!isMultiSelect}
            maxHeight={400}
            {...tableParams}
            // destroyOnUnmount={false}
            // keepDirtyOnReinitialize
            // enableReinitialize={true}
            // updateUnregisteredFields
          />
          <DialogFooter
            hideModal={hideModal}
            disabled={!selectedEntities.length}
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
);
