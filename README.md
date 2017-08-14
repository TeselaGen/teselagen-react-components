# TeselaGen-React-Components

Demo: http://reactcomponents.teselagen.com/


[![CircleCI](https://circleci.com/gh/TeselaGen/teselagen-react-components/tree/master.svg?style=shield)](https://circleci.com/gh/TeselaGen/teselagen-react-components/tree/master)
[![npm package][npm-badge]][npm]
[![codecov](https://codecov.io/gh/TeselaGen/teselagen-react-components/branch/master/graph/badge.svg)](https://codecov.io/gh/TeselaGen/teselagen-react-components)

# Using: 
```
yarn add teselagen-react-components
```
Add peer-dependencies: 
```
yarn add @blueprintjs/core @blueprintjs/datetime @blueprintjs/table antd react-addons-css-transition-group react-redux react-select redux 
```

##Vector Editor: 
Redux connected: 

```js
//store.js
import {vectorEditorReducer as VectorEditor} from 'teselagen-react-components'
const store = createStore(
  combineReducers({
    form: formReducer, 
    VectorEditor: VectorEditor({
		DemoEditor: {
			sequenceData: exampleSequenceData
		}
	})
  }),
  //otherArgsHere
)

//DemoEditor.js
import {createVectorEditor} from 'teselagen-react-components'
import store from '../store';

export default createVectorEditor({
  namespace: 'DemoEditor', 
  store,
  // actionOverrides(actions) {
  //   return {
  //     featureClicked: function ({annotation}) {
  //       return actions.caretPositionUpdate(annotation.start)
  //     },
  //     selectionLayerUpdate: function (selectionLayer) {
  //       return actions.caretPositionUpdate(selectionLayer.start)
  //     }
  //   }
  // }
})

//file where you want to display the editor: 
import DemoEditor from '../DemoEditor';
var {withEditorInteractions, withEditorProps, veSelectors, HoverHelper} = SelectInsertEditor
import {CircularView, LinearView, CutsiteFilter} from 'teselagen-react-components';

var CutsiteFilterConnected = withEditorProps(CutsiteFilter)
var CircularViewConnected = withEditorInteractions(CircularView)
var LinearViewConnected = withEditorInteractions(LinearView)

//some file where you want to do things to the demo editor
import DemoEditor from '../DemoEditor';
var {veActions} = DemoEditor
//see all actions by console logging veActions

dispatch(veActions.updateSequenceData(sequenceData)) //dispatch an update action the sequence data for the demo editor
```

##Data Table
```js
import {DataTable, routeDoubleClick, queryParams} from "teselagen-react-components";
import {toastr} from 'teselagen-react-components';
import {
	InputField,
	SelectField,
	DateInputField,
	CheckboxField,
	TextareaField,
	EditableTextField,
	ReactSelectField,
	NumericInputField,
	RadioGroupField,
	FileUploadField
} from 'teselagen-react-components'

<InputField
  name={"fieldName"}
  label="fieldLabel"
  placeholder="Enter text..."
  inputClassName="className(s) for input"
/>

```

## Prerequisites

[Node.js](http://nodejs.org/) >= v4 must be installed.

## Installation

- Running `npm install` in the components's root directory will install everything you need for development.

## Demo Development Server

- `npm start` will run a development server with the component's demo app at [http://localhost:3000](http://localhost:3000) with hot module reloading.

## Running Tests

- `npm test` will run the tests once.

- `npm run test:coverage` will run the tests and produce a coverage report in `coverage/`.

- `npm run test:watch` will run the tests on every change.

## Releasing

- `npm whoami` you should be teselagen
- `npm login` 
teselagen//ourMasterPass//team@teselagen.com
- git pull
- npm version patch|minor|major
- npm publish
- git push


## Adding custom svg icons
 - `yarn fontopen` this opens up our custom font file in the fontello webtool
 - add the svg icons you want, hit **Save Session** to commit your changes
 - then run `yarn fontsave`
 - commit the changes :)