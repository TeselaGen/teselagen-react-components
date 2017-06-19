import React from "react";
import { Provider } from "react-redux";
import store from "../store";
import tidyUpSequenceData from 've-sequence-utils/tidyUpSequenceData';
import exampleSequenceData from './exampleSequenceData';
import {
	CircularView,
	RowView,
	RowItem,
	VeToolBar,
	CutsiteFilter
} from "../../../src";

const data = tidyUpSequenceData(exampleSequenceData, {annotationsAsObjects: true})
console.log('data:', data)

export default function() {
	return (
		<Provider store={store}>
			<div>
				<h1>ve-editor Demo</h1>
				<VeToolBar></VeToolBar>
				<CircularView sequenceData={data}/>
				<RowView sequenceData={data}/>
			</div>
		</Provider>
	);
}
