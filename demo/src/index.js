import './style.css'
import React from 'react'
import { render } from 'react-dom'
import DataTableDemo from './DataTableDemo/index.js'
import VectorEditorDemo from './VectorEditorDemo/index.js'
import LoadingDemo from './LoadingDemo/index.js'
import FormComponentsDemo from './FormComponentsDemo'
import FontIconsDemo from './FontIconsDemo'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store';
import Perf from 'react-addons-perf'
import ReactTableDemo from './ReactTableDemo'

const demos = {
  vectoreditor: VectorEditorDemo,
  datatable: DataTableDemo,
  'react-table': ReactTableDemo,
  loading: LoadingDemo,
  formcomponents: FormComponentsDemo,
  fonticons: FontIconsDemo,
}

// Make the Perf object global for debugging purposes.
window.Perf = Perf

const Demo = () => {
  return (
    <div>
      <Provider store={store}>
        <Router>
          <div style={{margin: 15}}>
            <Route path="/" component={HomePage} />
            {
              Object.keys(demos).map(function (key, index) {
                return <Route key={index} path={`/${key}`} component={demos[key]} />
              })
            }
          </div>
        </Router>
      </Provider>
    </div>
  )
}

render(<Demo />, document.querySelector('#demo'))

function HomePage() {
  return (
    <div style={{display: 'flex'}}>
      {
        Object.keys(demos).map(function (name, index) {
          return <Link
            key={index}
              to={`/${name}`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <div style={  {borderLeft: index !== 0 && '2px solid grey'}} className={'pt-popover-dismiss pt-menu-item'}>
                {name} demo
              </div>

            </Link>
        })
      }
    </div>
  )
}
