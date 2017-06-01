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
			menuItems={function({ selectedRecords, history, selectedRows, regions }) {
				return [
					<MenuItem
						onClick={function() {
							console.log("I got clicked!");
						}}
						text={"menuText"}
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
