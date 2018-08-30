export default function combineReducers() {
  var reducers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var reducerKeys = Object.keys(reducers);
  return function combination() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];
    var fullState = arguments[2];

    var hasChanged = false;
    var nextState = {};
    fullState = fullState || state;
    for (var i = 0; i < reducerKeys.length; i++) {
      var key = reducerKeys[i];
      nextState[key] = reducers[key](state[key], action, fullState);
      hasChanged = hasChanged || nextState[key] !== state[key];
    }
    return hasChanged ? nextState : state;
  };
}