//@flow
import { change, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import queryParams from "./queryParams";
import compose from "lodash/fp/compose";
import { withRouter } from "react-router-dom";

export default function withTableParams(compOrOpts, pOptions) {
  let options;
  let Component;
  if (!pOptions) {
    options = compOrOpts;
  } else {
    options = pOptions;
    Component = compOrOpts;
  }
  let {
    formname,
    schema,
    defaults,
    urlConnected,
    isInfinite,
    onlyOneFilter
  } = options;
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

  const mapStateToProps = (state, { history }) => {
    const currentParams =
      (urlConnected
        ? getCurrentParamsFromUrl(history.location) //important to use history location and not ownProps.location because for some reason the location path lags one render behind!!
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
        dispatch(change(formname, "reduxFormQueryParams", newParams)); //we always will update the redux params as a workaround for withRouter not always working if inside a redux-connected container https://github.com/ReactTraining/react-router/issues/5037
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

  const toReturn = compose(
    connect(state => {
      return {
        unusedProp: formSelector(state, "reduxFormQueryParams") || {} //tnr: we need this to trigger withRouter and force it to update if it is nested in a redux-connected container.. very ugly but necessary
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
