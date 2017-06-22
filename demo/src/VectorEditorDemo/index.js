import React from "react";
import { Provider } from "react-redux";
import store from "../store";
import tidyUpSequenceData from 've-sequence-utils/tidyUpSequenceData';
import exampleSequenceData from './exampleSequenceData';

import {
	CircularView as _CircularView,
	RowView as _RowView,
	RowItem as _RowItem,
	VeToolBar as _VeToolBar,
	CutsiteFilter as _CutsiteFilter,
	createVectorEditor
} from "../../../src";

const {withEditorInteractions, withEditorProps} = createVectorEditor({
  namespace: 'DemoEditor', 
  store
})

const CircularView = withEditorInteractions(_CircularView)
const RowView = withEditorInteractions(_RowView)
const RowItem = withEditorProps(_RowItem)
const VeToolBar = withEditorProps(_VeToolBar)
const CutsiteFilter = withEditorProps(_CutsiteFilter)



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
