//@flow
import React from "react";
import {
	DataTable,
} from "../../../src";
import {entities} from './mocks';
import type {
  TableParams,
}  from '../../../src';

export default function DataTableWrapper (props) {
	var tableParams: TableParams = props.tableParams
	return <DataTable
	    {...tableParams}
	    entities={entities}
	    entityCount={entities.length}
	    onDoubleClick={function () {
	    	console.log('double clicked')
	    }}
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

