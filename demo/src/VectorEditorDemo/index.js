import React from "react";
import { FocusStyleManager } from "@blueprintjs/core";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { withTableParams } from "../../../src";

import {
  BrowserRouter as Router,
  withRouter
} from 'react-router-dom'

FocusStyleManager.onlyShowFocusOnTabs();

const store = createStore(
	combineReducers({
		// form
	}),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
import exampleSequenceData from '../../../src/VectorEditor/exampleData/exampleSequenceData';
console.log('exampleSequenceData:', exampleSequenceData)
import {
	CircularView,
	RowView,
	RowItem,
	VeToolBar,
	CutsiteFilter
} from "../../../src";


export default function() {
	return (
		<Provider store={store}>
			<div>
				<h1>ve-editor Demo</h1>
				<CircularView sequenceData={exampleSequenceData}/>
				<RowView sequenceData={exampleSequenceData}/>
			</div>
		</Provider>
	);
}
