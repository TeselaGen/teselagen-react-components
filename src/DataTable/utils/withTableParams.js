//@flow
import { withRouter } from "react-router-dom";
import React from "react";
import { Fields, change, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import queryParams from "./queryParams";

export default function withTableParams(
  Component,
  { formname, schema, defaults, urlConnected, isInfinite }
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
      filterOn,
      searchTerm
    } = getQueryParams(currentParams, urlConnected);
    return {
      queryParams,
      page,
      pageSize,
      order,
      selectedFilter,
      filterValue,
      filterOn,
      searchTerm,
      schema: schema,
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
        names={[
          "reduxFormQueryParams",
          "reduxFormSearchInput",
          "reduxFormSelectedEntityIdMap"
        ]}
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
  const {
    reduxFormQueryParams,
    reduxFormSearchInput,
    reduxFormSelectedEntityIdMap
  } = ownProps;
  return {
    ...ownProps,
    tableParams: {
      ...ownProps.tableParams,
      reduxFormQueryParams,
      reduxFormSearchInput,
      reduxFormSelectedEntityIdMap
    },
    reduxFormQueryParams: undefined,
    reduxFormSearchInput: undefined,
    reduxFormSelectedEntityIdMap: undefined
  };
}
