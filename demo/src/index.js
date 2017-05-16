import './style.css';
import React from "react";
import { render } from "react-dom";
import {
	DataTable,
} from "../../src";
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import {reducer as form} from 'redux-form';
const store = createStore(combineReducers({
	form
}))
let Demo = function () {
	return (
		<Provider store={store}>
			<div>
				<DataTable></DataTable>
			</div>
		</Provider>
	);
	
}

render(<Demo />, document.querySelector("#demo"));
