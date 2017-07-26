import React from "react";
import { FocusStyleManager, Dialog } from "@blueprintjs/core";
// import { createStore, combineReducers } from "redux";
// import { reducer as form } from "redux-form";
import DataTableWrapper from "./DataTableWrapper";
import { withTableParams } from "../../../src";
import { withTableParams_new } from "../../../src";
// import { onEnterOrBlurHelper } from "../../../src";

// import { columns, schema } from "./new_mocks";
import { schema } from "./new_schema_mocks";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
FocusStyleManager.onlyShowFocusOnTabs();

let UrlConnectedNew = withTableParams_new(DataTableWrapper, {
	urlConnected: true,
	formname: "example 1", //this should be a unique name
	schema
});
UrlConnectedNew = withRouter(UrlConnectedNew);

let UrlConnected = withTableParams(DataTableWrapper, {
	urlConnected: true,
	formname: "example 1", //this should be a unique name
	schema
});
UrlConnected = withRouter(UrlConnected);

const ReduxConnected = withTableParams(DataTableWrapper, {
	urlConnected: false,
	formname: "example 2",
	schema
});

const ReduxConnected2 = withTableParams(DataTableWrapper, {
	urlConnected: false,
	formname: "example 3",
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
							<h3>New Table</h3>
							<UrlConnectedNew />
							<h3>Old Table</h3>
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
