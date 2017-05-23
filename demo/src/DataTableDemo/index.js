import React from "react";
import { FocusStyleManager } from "@blueprintjs/core";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { reducer as form } from "redux-form";
import DataTableWrapper from "./DataTableWrapper";
import { withTableParams } from "../../../src";

import { columns, schema } from "./mocks";
import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom'

FocusStyleManager.onlyShowFocusOnTabs();

const store = createStore(
	combineReducers({
		form
	}),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

let UrlConnected = withTableParams(DataTableWrapper,{
	urlConnected: true,
	formname: "example 1", //this should be a unique name
	columns,
	schema
});
UrlConnected = withRouter(UrlConnected)

const ReduxConnected = withTableParams(DataTableWrapper,{
	urlConnected: false,
	formname: "example 2",
	columns,
	schema
});

export default function() {
	return (
		<Provider store={store}>
			<div>
				<Router>
					<UrlConnected />
				</Router>
				<ReduxConnected />
			</div>
		</Provider>
	);
}
