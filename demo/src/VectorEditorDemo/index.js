import React from "react";
import { Provider } from "react-redux";
import store from "../store";
import tidyUpSequenceData from "ve-sequence-utils/tidyUpSequenceData";
import exampleSequenceData from "./exampleSequenceData";

import {
	CircularView,
	RowView,
	// RowItem,
	VeToolBar,
	// CutsiteFilter,
	createVectorEditor
} from "../../../src";
const data = tidyUpSequenceData(exampleSequenceData, {
	annotationsAsObjects: true
});

const { withEditorInteractions, withEditorProps } = createVectorEditor({
	namespace: "DemoEditor",
});

const CircularViewConnected = withEditorInteractions(CircularView);
const RowViewConnected = withEditorInteractions(RowView);
// const RowItemConnected = withEditorProps(RowItem);
const VeToolBarConnected = withEditorProps(VeToolBar);
// const CutsiteFilterConnected = withEditorProps(CutsiteFilter);

export default function() {
	return (
		<Provider store={store}>
			<div>
				<h1>ve-editor Demo</h1>
				<VeToolBarConnected />
				<h2>Redux Connected (aka interactive!) </h2>
				<CircularViewConnected/>
				<RowViewConnected/>
				<h2>Not Redux Connected (aka non interactive) </h2>
				<CircularView sequenceData={data} />
				<RowView sequenceData={data} />
			</div>
		</Provider>
	);
}
