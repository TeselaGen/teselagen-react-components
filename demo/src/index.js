import './style.css'
import React from 'react'
import { render } from 'react-dom'
import DataTableDemo from './DataTableDemo/index.js'
import VectorEditorDemo from './VectorEditorDemo/index.js'
import LoadingDemo from './LoadingDemo/index.js'
import BlueprintReduxFormComponentsDemo
  from './BlueprintReduxFormComponentsDemo'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

let Demo = function() {
  return (
    <div>
      <Router>
        <div>
          <Route path="/" component={HomePage} />
          <Route path="/vectoreditor" component={VectorEditorDemo} />
          <Route path="/datatable" component={DataTableDemo} />
          <Route path="/loading" component={LoadingDemo} />
          <Route
            path="/blueprintreduxformcomponents"
            component={BlueprintReduxFormComponentsDemo}
          />
        </div>
      </Router>
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
          VectorEditorDemo
        </div>
      </Link>
      <Link
        to="/datatable"
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        <div className={'pt-popover-dismiss pt-menu-item'}>
          DataTableDemo
        </div>
      </Link>
      <Link to="/loading" style={{ color: 'inherit', textDecoration: 'none' }}>
        <div className={'pt-popover-dismiss pt-menu-item'}>
          LoadingDemo
        </div>
      </Link>
      <Link
        to="/formcomponents"
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        <div className={'pt-popover-dismiss pt-menu-item'}>
          BlueprintReduxFormComponentsDemo
        </div>
      </Link>
    </div>
  )
}
