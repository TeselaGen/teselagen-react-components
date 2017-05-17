import React from "react";
import toArray from "lodash/toArray";
import { FocusStyleManager } from "@blueprintjs/core";
FocusStyleManager.onlyShowFocusOnTabs();

const MOCK_MATERIALS = {
  "1": {
    name: "Material 1asdasdasdasdasdasdasdasdasdasdasdassa",
    addedBy: "Sam DeNicola",
    lastEdited: new Date().toLocaleString(),
    dateCreated: new Date().toLocaleString()
  },
  "2": {
    name: "Material 2",
    addedBy: "Sam DeNicola",
    lastEdited: new Date().toLocaleString(),
    dateCreated: new Date().toLocaleString()
  },
  "3": {
    name: "Material 3",
    addedBy: "Mike Fero",
    lastEdited: new Date().toLocaleString(),
    dateCreated: new Date().toLocaleString()
  },
  "4": {
    name: "Material 4",
    addedBy: "Sam DeNicola",
    lastEdited: new Date().toLocaleString(),
    dateCreated: new Date().toLocaleString()
  }
};
const entities = toArray(MOCK_MATERIALS);

import {
	DataTable,
	queryParams,
} from "../../src";


import {Provider, connect} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import {reducer as form} from 'redux-form';
const store = createStore(combineReducers({
	form
}))

const schema = {
  fields: {
    name: { type: "string", displayName: "Name" },
    addedBy: {
      type: "string",
      displayName: "Added By"
    },
    dateCreated: { type: "timestamp", displayName: "Date Created" },
    lastEdited: { type: "timestamp", displayName: "Last Edited" }
  }
};

const columns = ["name", "addedBy", "dateCreated", "lastEdited"];

const { getQueryParamsFromRouter, setQueryParamsOnRouter } = queryParams({
  columns,
  schema
  // defaults: { /*override defaults here*/
  //   limit: 20
  // }
});

const mapStateToProps = (state, ownProps) => {
  const {
    queryParams,
    page,
    pageSize,
    order,
    selectedFilter,
    filterValue,
    fieldName,
    searchTerm
  } = getQueryParamsFromRouter(ownProps);
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
    columns
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const {
    setSearchTerm,
    setFilter,
    clearFilters,
    setPageSize,
    setPage,
    setOrder
  } = setQueryParamsOnRouter(dispatch, ownProps);
  return {
    setSearchTerm,
    setFilter,
    clearFilters,
    setPageSize,
    setPage,
    setOrder
  };
};

var ReduxTable = connect (mapStateToProps, mapDispatchToProps)(DataTableWrapper)
function DataTableWrapper (props) {
	var {
		page,
		pageSize,
		order,
		selectedFilter,
		filterValue,
		fieldName,
		searchTerm,
		schema,
		columns,
		setSearchTerm,
		setFilter,
		clearFilters,
		setPageSize,
		setPage,
		setOrder,
	} = props

	return <DataTable
	    entities={entities}
	    schema={schema}
	    extraClasses={'hah'}
	    entityCount={entities.length}
	    page={page}
	    pageSize={pageSize}
	    order={order}
	    // filter={filter}
	    searchTerm={searchTerm}
	    selectedFilter={selectedFilter}
	    filterValue={filterValue}
	    fieldName={fieldName}
	    columns={columns}
	    setFilter={setFilter}
	    clearFilters={clearFilters}
	    setPageSize={setPageSize}
	    setOrder={setOrder}
	    setPage={setPage}
	    setSearchTerm={setSearchTerm}
	    onDoubleClick={noop}
	    // children={children}
	    withTitle={true}
	    withSearch={true}
	    withPaging={true}
	    isInfinite={false}
	    // history={history}
	    onSingleRowSelect={noop}
	    onDeselect={noop}
	    onMultiRowSelect={noop}
	  />
}

function noop() {}



export default function () {

return <Provider store={store}>
	<ReduxTable></ReduxTable>
</Provider>
}
