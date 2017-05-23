import React from "react";
import {
	DataTable,
} from "../../../src";
import {entities} from './mocks';


export default function DataTableWrapper (props) {
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
		reduxFormSearchInput,
	} = props
	return <DataTable
	    entities={entities}
	    schema={schema}
	    // extraClasses={}
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
	    reduxFormSearchInput={reduxFormSearchInput}
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

