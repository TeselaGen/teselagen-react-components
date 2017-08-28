//@flow
import { change, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import queryParams from "./queryParams";
import compose from "lodash/fp/compose";
import { withRouter } from "react-router-dom";

export default function withTableParams(
  Component,
  { formname, schema, defaults, urlConnected, isInfinite, onlyOneFilter }
) {
  if (!urlConnected && !formname) {
    console.warn(
      "Please pass a formname to the withTableParams if your table is not url connected"
    );
  }

  if (!formname) {
    formname = "tgDataTable";
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
    onlyOneFilter,
    isInfinite
  });

  const mapStateToProps = (state, { location }) => {
    const currentParams =
      (urlConnected
        ? getCurrentParamsFromUrl(location)
        : formSelector(state, "reduxFormQueryParams")) || {};
    return {
      ...getQueryParams(currentParams, urlConnected),
      schema,
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
        ...boundDispatchProps,
        form: formname //this will override the default redux form name
      }
    };
  }

  return compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps, mergeProps)
  )(Component);
}
