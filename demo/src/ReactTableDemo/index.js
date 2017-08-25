import React from "react";
import { FocusStyleManager, Dialog } from "@blueprintjs/core";
// import { createStore, combineReducers } from "redux";
// import { reducer as form } from "redux-form";
import DataTableWrapper from "./DataTableWrapper";
import { withTableParams } from "../../../src";
// import { onEnterOrBlurHelper } from "../../../src";

// import { columns, schema } from "./new_mocks";
import { schema } from "./new_schema_mocks";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
FocusStyleManager.onlyShowFocusOnTabs();

let UrlConnected = withTableParams(DataTableWrapper, {
	urlConnected: true,
	formname: "example 1", //this should be a unique name
	schema
});
UrlConnected = withRouter(UrlConnected);

let ReduxConnected = withTableParams(DataTableWrapper, {
	urlConnected: false,
	formname: "example 2", //this should be a unique name
	schema
});
ReduxConnected = withRouter(ReduxConnected);

export { DataTableWrapper, UrlConnected, ReduxConnected };
export default class TableDemo extends React.Component {
	render() {
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
							<h3>URL Connected</h3>
							<br/>
							<UrlConnected />
							<br/>
							<h3>Redux Connected</h3>
							<br/>
							<ReduxConnected />
							<br/>
							<h3>Unconnected - Not connected to params (aka you'll need to handle paging/sort/filter yourself) </h3>
							<DataTableWrapper {...{tableParams: {
								schema,
							}}} />
							<br/>
						</div>
					</Router>
				</div>
			</Provider>
		);
	}
}
