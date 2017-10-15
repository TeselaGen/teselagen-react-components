import exampleSequenceData from './VectorEditorDemo/exampleSequenceData';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { reducer as form } from 'redux-form'
import {vectorEditorReducer as VectorEditor} from '../../src'
import thunk from 'redux-thunk';

const composeEnhancer = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
	actionsBlacklist: ['HOVEREDANNOTATIONUPDATE', 'HOVEREDANNOTATIONCLEAR']
})) || compose;

const store = createStore(
  combineReducers({
    form,
    VectorEditor: VectorEditor({DemoEditor: {sequenceData: exampleSequenceData}})
  }),
  undefined,
  composeEnhancer(
  	  applyMiddleware(thunk) //your store should be redux-thunk connected for the VectorEditor component to work
  	)
  
)

export default store