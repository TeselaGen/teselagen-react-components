var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//we use this to make adding preset prop groups simpler
export default function computePresets(props) {
  var isSimple = props.isSimple;

  var toReturn = _extends({}, props);
  if (isSimple) {
    //isSimplePreset
    toReturn = _extends({
      noHeader: true,
      noFooter: true,
      noPadding: true,
      noFullscreenButton: true,
      hidePageSizeWhenPossible: true,
      isInfinite: true,
      hideSelectedCount: true,
      withTitle: false,
      withSearch: false,
      withPaging: false,
      withFilter: false
    }, toReturn);
  } else {
    toReturn = _extends({
      // the usual defaults:
      noFooter: false,
      noPadding: false,
      noFullscreenButton: false,
      hidePageSizeWhenPossible: false,
      isInfinite: false,
      hideSelectedCount: false,
      withTitle: true,
      withSearch: true,
      withPaging: true,
      withFilter: true
    }, toReturn);
  }
  return toReturn;
}