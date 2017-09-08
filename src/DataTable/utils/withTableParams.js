//@flow
import { change, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import {
  makeDataTableHandlers,
  getQueryParams,
  setCurrentParamsOnUrl,
  getMergedOpts,
  getCurrentParamsFromUrl
} from "./queryParams";
import compose from "lodash/fp/compose";
import { withRouter } from "react-router-dom";

export default function withTableParams(compOrOpts, pTopLevelOpts) {
  let topLevelOptions;
  let Component;
  if (!pTopLevelOpts) {
    topLevelOptions = compOrOpts;
  } else {
    topLevelOptions = pTopLevelOpts;
    Component = compOrOpts;
  }
  const { isLocalCall } = topLevelOptions;

  const mapStateToProps = (state, ownProps) => {
    if (ownProps.isTableParamsConnected) {
      //short circuit because we've already run this logic
      return {};
    }
    const mergedOpts = getMergedOpts(topLevelOptions, ownProps);
    const {
      history,
      urlConnected,
      formname,
      defaults,
      schema,
      isInfinite
    } = mergedOpts;
    if (isLocalCall && !ownProps.isTableParamsConnected && !formname) {
      console.error(
        "Please pass a unique 'formname' prop to the locally connected table with schema: ",
        schema
      );
    }
    const currentParams =
      (urlConnected
        ? getCurrentParamsFromUrl(history.location) //important to use history location and not ownProps.location because for some reason the location path lags one render behind!!
        : formValueSelector(formname)(state, "reduxFormQueryParams")) || {};
    return {
      ...mergedOpts,
      ...getQueryParams({
        currentParams,
        entities: ownProps.entities,
        urlConnected,
        defaults,
        schema,
        isInfinite,
        isLocalCall
      }),
      currentParams,
      initialValues: { reduxFormSearchInput: currentParams.searchTerm }
    };
  };

  const mapDispatchToProps = (dispatch, ownProps) => {
    if (ownProps.isTableParamsConnected) {
      return {};
    }
    const mergedOpts = getMergedOpts(topLevelOptions, ownProps);
    const {
      formname,
      urlConnected,
      history,
      defaults,
      onlyOneFilter
    } = mergedOpts;
    function resetSearch() {
      setTimeout(function() {
        dispatch(change(formname, "reduxFormSearchInput", ""));
      });
    }
    let setNewParams;
    if (urlConnected) {
      setNewParams = function(newParams) {
        setCurrentParamsOnUrl(newParams, history.push);
        dispatch(change(formname, "reduxFormQueryParams", newParams)); //we always will update the redux params as a workaround for withRouter not always working if inside a redux-connected container https://github.com/ReactTraining/react-router/issues/5037
      };
    } else {
      setNewParams = function(newParams) {
        dispatch(change(formname, "reduxFormQueryParams", newParams));
      };
    }
    return makeDataTableHandlers({
      setNewParams,
      resetSearch,
      defaults,
      onlyOneFilter
    });
  };

  function mergeProps(stateProps, dispatchProps, ownProps) {
    if (ownProps.isTableParamsConnected) {
      return ownProps;
    }
    const { currentParams, formname } = stateProps;
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
        form: formname, //this will override the default redux form name
        isTableParamsConnected: true //let the table know not to do local sorting/filtering etc.
      }
    };
  }

  const toReturn = compose(
    connect((state, ownProps) => {
      if (ownProps.isTableParamsConnected) {
        return {};
      }
      const { formname } = getMergedOpts(topLevelOptions, ownProps);
      return {
        unusedProp:
          formValueSelector(formname)(state, "reduxFormQueryParams") || {} //tnr: we need this to trigger withRouter and force it to update if it is nested in a redux-connected container.. very ugly but necessary
      };
    }),
    withRouter,
    connect(mapStateToProps, mapDispatchToProps, mergeProps)
  );
  if (Component) {
    return toReturn(Component);
  }
  return toReturn;
}
