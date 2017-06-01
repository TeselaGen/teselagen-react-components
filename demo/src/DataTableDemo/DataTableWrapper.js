//@flow
import React from "react";
import { DataTable } from "../../../src";
import { entities } from "./mocks";
import type { TableParams } from "../../../src";
import { MenuItem } from "@blueprintjs/core";

export default function DataTableWrapper(props) {
	var tableParams: TableParams = props.tableParams;
	return (
		<DataTable
			{...tableParams}
			entities={entities}
			entityCount={entities.length}
			onDoubleClick={function() {
				console.log("double clicked");
			}}
			contextMenu={function({ selectedRecords, history, selectedRows, regions }) {
				return [
					<MenuItem
						onClick={function() {
							console.log("I got clicked!");
						}}
						text={"Menu text here"}
					/>,
					<MenuItem
						onClick={function() {
							console.log("I also got clicked!");
						}}
						text={"Some more"}
					/>
				];
			}}
			withTitle={true}
			withSearch={true}
			withPaging={true}
			isInfinite={false}
			onRefresh={() => {
				alert("clicked refresh!");
			}}
			// history={history}
			onSingleRowSelect={noop}
			onDeselect={noop}
			onMultiRowSelect={noop}
		/>
	);
}

function noop() {}
