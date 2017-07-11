//@flow
import { withRouter } from "react-router-dom";
import React from "react";
import { Fields, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { formValueSelector } from "redux-form";
import queryParams from "./queryParams";
import { change } from "redux-form";

export default function withTableParams(
  Component,
  { formname, columns, schema, defaults, urlConnected, isInfinite }
) {
  if (!urlConnected && !formname) {
    console.warn(
      "Please pass a formname to the withTableParams if your table is not url connected"
    );
  }

  if (!formname) {
    formname = "dataTableQueryParams";
  }

  const formSelector = formValueSelector(formname);

  const {
    makeDataTableHandlers,
    getQueryParams,
    setCurrentParamsOnUrl,
    getCurrentParamsFromUrl
  } = queryParams({
    columns,
    schema,
    formname,
    defaults,
    isInfinite
  });

  const mapStateToProps = (state, { location }) => {
    const currentParams =
      (urlConnected
        ? getCurrentParamsFromUrl(location)
        : formSelector(state, "reduxFormQueryParams")) || {};
    const {
      queryParams,
      page,
      pageSize,
      order,
      selectedFilter,
      filterValue,
      fieldName,
      searchTerm
    } = getQueryParams(currentParams);
    return {
      queryParams,
      page,
      pageSize,
      order,
      selectedFilter,
      filterValue,
      fieldName,
      searchTerm,
      schema: schema,
      columns,
      currentParams,
      initialValues: { reduxFormSearchInput: currentParams.searchTerm }
    };
  };

  const mapDispatchToProps = (dispatch, ownProps) => {
    function resetSearch() {
      setTimeout(function() {
        dispatch(change(formname, "reduxFormSearchInput", ""));
      });
    }
    let setNewParams;
    if (urlConnected) {
      setNewParams = function(newParams) {
        setCurrentParamsOnUrl(newParams, ownProps.history.push);
      };
    } else {
      setNewParams = function(newParams) {
        dispatch(change(formname, "reduxFormQueryParams", newParams));
      };
    }
    return makeDataTableHandlers({
      setNewParams,
      resetSearch
    });
  };

  function mergeProps(stateProps, dispatchProps, ownProps) {
    const { currentParams } = stateProps;
    let boundDispatchProps = {};
    //bind currentParams to actions
    Object.keys(dispatchProps).forEach(function(key) {
      const action = dispatchProps[key];
      boundDispatchProps[key] = function(...args) {
        action(...args, currentParams);
      };
    });

    return {
      ...ownProps,
      queryParams: stateProps.queryParams,
      tableParams: {
        ...ownProps.tableParams,
        ...stateProps,
        ...dispatchProps,
        ...boundDispatchProps
      }
    };
  }
  const ConnectedComponent = connect(mapState)(Component);
  let QueryParams = function(props) {
    return (
      <Fields
        names={["reduxFormQueryParams", "reduxFormSearchInput"]}
        {...props}
        component={ConnectedComponent}
      />
    );
  };

  return withRouter(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      reduxForm({ form: formname })(QueryParams)
    )
  );
}

function mapState(state, ownProps) {
  const { reduxFormQueryParams, reduxFormSearchInput } = ownProps;
  return {
    ...ownProps,
    tableParams: {
      ...ownProps.tableParams,
      reduxFormQueryParams,
      reduxFormSearchInput
    },
    reduxFormQueryParams: undefined,
    reduxFormSearchInput: undefined
  };
}
