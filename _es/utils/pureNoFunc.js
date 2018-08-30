/**
 * This HOC compares props to create a pure component that will only update
 * when props are not deep equal. It will compare the string values of functions
 */
import { shouldUpdate } from "recompose";
import { isEqualWith, isFunction } from "lodash";

var isEq = function isEq(o1, o2) {
  var isEq = isEqualWith(o1, o2, function (val1, val2) {
    if (isFunction(val1) && isFunction(val2)) {
      return val1 === val2 || val1.toString() === val2.toString();
    }
  });
  return isEq;
};

var pure = function pure(BaseComponent) {
  var hoc = shouldUpdate(function (props, nextProps) {
    return !isEq(props, nextProps);
  });
  return hoc(BaseComponent);
};

export default pure;