import React from "react";
import {
	DataTable,
} from "../../../src";
import {entities} from './mocks';


export default function DataTableWrapper (props) {
	var {
		tableParams,
	} = props
	return <DataTable
	    {...tableParams}
	    entities={entities}
	    entityCount={entities.length}
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

