import React from "react";
import { FocusStyleManager, Dialog } from "@blueprintjs/core";
// import { createStore, combineReducers } from "redux";
// import { reducer as form } from "redux-form";
import DataTableWrapper from "./DataTableWrapper";
import { withTableParams } from "../../../src";
// import { onEnterOrBlurHelper } from "../../../src";

import { columns, schema } from "./mocks";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
FocusStyleManager.onlyShowFocusOnTabs();

let UrlConnected = withTableParams(DataTableWrapper, {
	urlConnected: true,
	formname: "example 1", //this should be a unique name
	columns,
	schema
});
UrlConnected = withRouter(UrlConnected);

const ReduxConnected = withTableParams(DataTableWrapper, {
	urlConnected: false,
	formname: "example 2",
	columns,
	schema
});

const ReduxConnected2 = withTableParams(DataTableWrapper, {
	urlConnected: false,
	formname: "example 3",
	columns,
	schema
});

export { UrlConnected, ReduxConnected, DataTableWrapper };
export default class TableDemo extends React.Component {
	render() {
		var { open, allowMultipleSelection=false } = this.state || {};
		const tableParams = {
									bpTableProps: {
										allowMultipleSelection
									}
								}
		return (
			<Provider store={store}>
				<div
				>
					<Router>
						<div>
							<button
								onClick={() => {
									this.setState({
										open: true
									});
								}}
							>
								{" "}open table in dialog
							</button>
							<button
								onClick={() => {
									this.setState({
										allowMultipleSelection: !allowMultipleSelection
									});
								}}
							>
								{" "}{allowMultipleSelection ? 'disable ' : 'enable '} multiple row selection
							</button>
							<UrlConnected />
							<ReduxConnected 
								tableParams={tableParams}
							/>
							<Dialog
								style={{width: "640px"}}
								isOpen={open}
								onClose={() => {
									this.setState({
										open: false
									});
								}}
							>
								<ReduxConnected2 tableParams={tableParams} />
							</Dialog>
						</div>
					</Router>
				</div>
			</Provider>
		);
	}
}
