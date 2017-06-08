import React from "react";
import { Provider } from "react-redux";
import store from "../store";

import exampleSequenceData from '../../../src/VectorEditor/exampleData/exampleSequenceData';
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
