import React from "react";
import { FocusStyleManager, Dialog } from "@blueprintjs/core";
// import { createStore, combineReducers } from "redux";
// import { reducer as form } from "redux-form";
import DataTableWrapper from "./DataTableWrapper";
import { withTableParams } from "../../../src";
import { onEnterOrBlurHelper } from "../../../src";

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
		var { open } = this.state || {};
		return (
			<Provider store={store}>
				<div
					{...onEnterOrBlurHelper(function() {
						console.log("blurred or entered");
					})}
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
							<UrlConnected />
							<ReduxConnected />
							<Dialog
								isOpen={open}
								onClose={() => {
									this.setState({
										open: false
									});
								}}
							>
								<ReduxConnected2 />
							</Dialog>
						</div>
					</Router>
				</div>
			</Provider>
		);
	}
}
