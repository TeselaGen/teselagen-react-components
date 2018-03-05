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
import { map } from "lodash";
import { withRouter } from "react-router-dom";
import { branch } from "recompose";

/**
 *  Note all these options can be passed at Design Time or at Runtime (like reduxForm())
 *
 * @export
 *
 * @param {compOrOpts} compOrOpts
 * @typedef {object} compOrOpts
 * @property {*string} formName - required unique identifier for the table
 * @property {*boolean} schema - The data table schema
 * @property {boolean} urlConnected - whether the table should connect to/update the URL
 * @property {boolean} withSelectedEntities - whether or not to pass the selected entities
 * @property {object} defaults - tableParam defaults such as pageSize, filter, etc
 */
import convertSchema from "./convertSchema";

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
    const mergedOpts = getMergedOpts(topLevelOptions, ownProps);
    const {
      history,
      urlConnected,
      withSelectedEntities,
      formName,
      formNameFromWithTPCall,
      defaults,
      schema,
      isInfinite,
      isSimple,
      initialValues,
      additionalFilter = {}
    } = mergedOpts;

    if (ownProps.isTableParamsConnected) {
      if (
        formName &&
        formNameFromWithTPCall &&
        formName !== formNameFromWithTPCall
      ) {
        console.error(
          `You passed a formName prop, ${formName} to a <DataTable/> component that is already withTableParams() connected, formNameFromWithTableParamsCall: ${formNameFromWithTPCall}`
        );
      }
      if (ownProps.tableParams && !ownProps.tableParams.entities) {
        console.error(
          `No entities array detected in tableParams object (<DataTable {...tableParams}/>). You need to call withQuery() after withTableParams() like: compose(withTableParams(), withQuery(something)). formNameFromWithTableParamsCall: ${formNameFromWithTPCall}`
        );
      }
      //short circuit because we've already run this logic
      return {};
    }

    let formNameFromWithTableParamsCall;
    if (isLocalCall) {
      if (!formName || formName === "tgDataTable") {
        console.error(
          "Please pass a unique 'formName' prop to the locally connected <DataTable/> component with schema: ",
          schema
        );
      }
    } else {
      //in user instantiated withTableParams() call
      if (!formName || formName === "tgDataTable") {
        console.error(
          "Please pass a unique 'formName' prop to the withTableParams() with schema: ",
          schema
        );
      } else {
        formNameFromWithTableParamsCall = formName;
      }
    }

    const formSelector = formValueSelector(formName);
    const currentParams =
      (urlConnected
        ? getCurrentParamsFromUrl(history.location) //important to use history location and not ownProps.location because for some reason the location path lags one render behind!!
        : formSelector(state, "reduxFormQueryParams")) || {};

    let selectedEntities;
    if (withSelectedEntities) {
      const selectedEntityIdMap =
        formSelector(state, "reduxFormSelectedEntityIdMap") || {};
      selectedEntities = map(selectedEntityIdMap, ({ entity }) => entity);
    }
    const additionalFilterToUse =
      typeof additionalFilter === "function"
        ? additionalFilter.bind(this, ownProps)
        : () => additionalFilter;
    return {
      ...mergedOpts,
      ...getQueryParams({
        currentParams,
        entities: ownProps.entities, // for local table
        urlConnected,
        defaults,
        schema: convertSchema(schema),
        isInfinite: isInfinite || isSimple,
        isLocalCall,
        additionalFilter: additionalFilterToUse
      }),
      formNameFromWithTPCall: formNameFromWithTableParamsCall,
      // randomVarToForceLocalStorageUpdate: formSelector(state, "localStorageForceUpdate"),
      currentParams,
      selectedEntities,
      ...(withSelectedEntities && typeof withSelectedEntities === "string"
        ? {
            [withSelectedEntities]: selectedEntities
          }
        : {}),
      initialValues: {
        ...initialValues,
        reduxFormSearchInput: currentParams.searchTerm
      }
    };
  };

  const mapDispatchToProps = (dispatch, ownProps) => {
    if (ownProps.isTableParamsConnected) {
      return {};
    }
    const mergedOpts = getMergedOpts(topLevelOptions, ownProps);
    const {
      formName,
      urlConnected,
      history,
      defaults,
      onlyOneFilter
    } = mergedOpts;
    function resetSearch() {
      setTimeout(function() {
        dispatch(change(formName, "reduxFormSearchInput", ""));
      });
    }
    let setNewParams;
    if (urlConnected) {
      setNewParams = function(newParams) {
        setCurrentParamsOnUrl(newParams, history.replace);
        dispatch(change(formName, "reduxFormQueryParams", newParams)); //we always will update the redux params as a workaround for withRouter not always working if inside a redux-connected container https://github.com/ReactTraining/react-router/issues/5037
      };
    } else {
      setNewParams = function(newParams) {
        dispatch(change(formName, "reduxFormQueryParams", newParams));
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
    const { currentParams, formName } = stateProps;
    let boundDispatchProps = {};
    //bind currentParams to actions
    Object.keys(dispatchProps).forEach(function(key) {
      const action = dispatchProps[key];
      boundDispatchProps[key] = function(...args) {
        action(...args, currentParams);
      };
    });
    const { variables, selectedEntities, ...restStateProps } = stateProps;
    return {
      ...ownProps,
      variables: stateProps.variables,
      selectedEntities: stateProps.selectedEntities,
      tableParams: {
        ...ownProps.tableParams,
        ...restStateProps,
        ...dispatchProps,
        ...boundDispatchProps,
        form: formName, //this will override the default redux form name
        isTableParamsConnected: true //let the table know not to do local sorting/filtering etc.
      }
    };
  }

  const toReturn = compose(
    connect((state, ownProps) => {
      if (ownProps.isTableParamsConnected) {
        return {};
      }
      const { formName } = getMergedOpts(topLevelOptions, ownProps);
      return {
        unusedProp:
          formValueSelector(formName)(state, "reduxFormQueryParams") || {} //tnr: we need this to trigger withRouter and force it to update if it is nested in a redux-connected container.. very ugly but necessary
      };
    }),
    branch(props => {
      //don't use withRouter if noRouter is passed!
      return !props.noRouter;
    }, withRouter),
    connect(mapStateToProps, mapDispatchToProps, mergeProps)
  );
  if (Component) {
    return toReturn(Component);
  }
  return toReturn;
}
