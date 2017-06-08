import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

const store = createStore(
  combineReducers({
    formReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store