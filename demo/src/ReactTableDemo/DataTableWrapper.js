//@flow
import React from "react";
import { ReactTable } from "../../../src";
import { entities } from "./new_schema_mocks";
import { MenuItem, Switch } from "@blueprintjs/core";

export default class DataTableWrapper extends React.Component {
	state={
		withTitle: true,
		withSearch: true,
		withPaging: true,
		isInfinite: false,
		withCheckboxes: true,
	}
	render() {
		const renderToggle = type => {
			return (
				<Switch
					checked={this.state[type]}
					label={type}
					onChange={() => {
						this.setState({
							[type]: !this.state[type]
						});
					}}
				/>
			);
		};

		const { tableParams } = this.props;
		const {page, pageSize} = tableParams
		let entitiesToPass = []
		if (this.state.isInfinite) {
			entitiesToPass = entities
		} else {
			for (var i = (page - 1) * pageSize; i < page*pageSize; i++) {
				entities[i] && entitiesToPass.push(entities[i])
			}
		}
		return (
			<div>
				{renderToggle("withTitle")}
				{renderToggle('withSearch')}
				{renderToggle('withPaging')}
				{renderToggle('isInfinite')}
				{renderToggle('withCheckboxes')}
				<ReactTable
					{...tableParams}
					entities={entitiesToPass}
					entityCount={entities.length}
					onDoubleClick={function() {
						console.log("double clicked");
					}}
					title={'Demo table'}
					contextMenu={function({
						selectedRecords,
						history,
						selectedRows,
						regions
					}) {
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
					withTitle={this.state.withTitle}
					withSearch={this.state.withSearch}
					withPaging={this.state.withPaging}
					isInfinite={this.state.isInfinite}
					withCheckboxes={this.state.withCheckboxes}
					onRefresh={() => {
						alert("clicked refresh!");
					}}
					// history={history}
					onSingleRowSelect={noop}
					onDeselect={noop}
					onMultiRowSelect={noop}
				/>
				<br/>
				<br/>
				
			</div>
		);
	}
}

function noop() {}
