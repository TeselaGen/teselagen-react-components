import './style.css'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import DataTableDemo from './DataTableDemo/index.js'
import VectorEditorDemo from './VectorEditorDemo/index.js'
import LoadingDemo from './LoadingDemo/index.js'
import FormComponentsDemo from './FormComponentsDemo'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const store = createStore(
  combineReducers({
    formReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const Demo = () => {
  return (
    <div>
      <Provider store={store}>
        <Router>
          <div>
            <Route path="/" component={HomePage} />
            <Route path="/vectoreditor" component={VectorEditorDemo} />
            <Route path="/datatable" component={DataTableDemo} />
            <Route path="/loading" component={LoadingDemo} />
            <Route path="/formcomponents" component={FormComponentsDemo} />
          </div>
        </Router>
      </Provider>
    </div>
  )
}

render(<Demo />, document.querySelector('#demo'))

function HomePage() {
  return (
    <div>
      <Link
        to="/vectoreditor"
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        <div className={'pt-popover-dismiss pt-menu-item'}>
          Vector Editor Demo
        </div>
      </Link>
      <Link
        to="/datatable"
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        <div className={'pt-popover-dismiss pt-menu-item'}>
          Data Table Demo
        </div>
      </Link>
      <Link to="/loading" style={{ color: 'inherit', textDecoration: 'none' }}>
        <div className={'pt-popover-dismiss pt-menu-item'}>
          Loading Demo
        </div>
      </Link>
      <Link
        to="/formcomponents"
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        <div className={'pt-popover-dismiss pt-menu-item'}>
          Form Components Demo
        </div>
      </Link>
    </div>
  )
}
