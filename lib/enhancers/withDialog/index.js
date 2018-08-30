"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = withDialog;

var _redux = require("redux");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _core = require("@blueprintjs/core");

var _reactRedux = require("react-redux");

var _recompose = require("recompose");

var _uniqid = require("uniqid");

var _uniqid2 = _interopRequireDefault(_uniqid);

var _ResizableDraggableDialog = require("../../ResizableDraggableDialog");

var _ResizableDraggableDialog2 = _interopRequireDefault(_ResizableDraggableDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * usage:
 * in container:
 * compose(
 *   withDialog({ title: "Select Aliquot(s) From", other bp dialog props here  })
 * )
 *
 * in react component
 * import MyDialogEnhancedComponent from "./MyDialogEnhancedComponent"
 *
 * render() {
 *  return <div>
 *    <MyDialogEnhancedComponent
 *      dialogProps={} //bp dialog overrides can go here
 *      dialogName={string} **OPTIONAL** a unique dialog name can optionally be passed
 *      target={<button>Open Dialog</button> } //target can also be passed as a child component
 *      myRandomProp={'yuppp'} //pass any other props like normal to the component
 *
 *    />
 *  </div>
 * }
 */

function withDialog(topLevelDialogProps) {
  function dialogHoc(WrappedComponent) {
    return function (_React$Component) {
      _inherits(DialogWrapper, _React$Component);

      function DialogWrapper() {
        _classCallCheck(this, DialogWrapper);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
      }

      DialogWrapper.prototype.componentWillUnmount = function componentWillUnmount() {
        var _props = this.props,
            dispatch = _props.dispatch,
            dialogName = _props.dialogName,
            uniqueName = _props.uniqueName;

        if (dialogName) {
          dispatch({
            type: "TG_UNREGISTER_MODAL",
            name: dialogName,
            uniqueName: uniqueName
          });
        }
      };

      DialogWrapper.prototype.render = function render() {
        var _React$cloneElement;

        var _props2 = this.props,
            target = _props2.target,
            noTarget = _props2.noTarget,
            isDialogOpen = _props2.isDialogOpen,
            showModal = _props2.showModal,
            onClickRename = _props2.onClickRename,
            hideModal = _props2.hideModal,
            _props2$fetchPolicy = _props2.fetchPolicy,
            fetchPolicy = _props2$fetchPolicy === undefined ? "network-only" : _props2$fetchPolicy,
            children = _props2.children,
            dialogProps = _props2.dialogProps,
            title = _props2.title,
            isDraggable = _props2.isDraggable,
            alreadyRendering = _props2.alreadyRendering,
            rest = _objectWithoutProperties(_props2, ["target", "noTarget", "isDialogOpen", "showModal", "onClickRename", "hideModal", "fetchPolicy", "children", "dialogProps", "title", "isDraggable", "alreadyRendering"]);

        var extraDialogProps = _extends({}, topLevelDialogProps, dialogProps);

        var _props$extraDialogPro = _extends({}, this.props, extraDialogProps),
            noButtonClickPropagate = _props$extraDialogPro.noButtonClickPropagate;

        var isOpen = isDialogOpen || extraDialogProps.isOpen;
        var targetEl = target || children;
        if (!targetEl && !noTarget) throw new Error("withDialog error: Please provide a target or child element to the withDialog() enhanced component. If you really don't want a target, please pass a 'noTarget=true' prop");
        var DialogToUse = isDraggable || extraDialogProps.isDraggable ? _ResizableDraggableDialog2.default : _core.Dialog;
        return _react2.default.createElement(
          _react2.default.Fragment,
          null,
          isOpen && _react2.default.createElement(
            DialogToUse,
            _extends({
              onClose: function onClose() {
                hideModal();
              },
              title: title,
              isOpen: isOpen
            }, extraDialogProps),
            _react2.default.createElement(WrappedComponent, _extends({}, rest, {
              fetchPolicy: fetchPolicy,
              ssr: false,
              hideModal: hideModal
            }))
          ),
          targetEl && _react2.default.cloneElement(targetEl, (_React$cloneElement = {}, _React$cloneElement[onClickRename || "onClick"] = function (e) {
            showModal();
            if (noButtonClickPropagate) {
              e.preventDefault();
              e.stopPropagation();
            }
          }, _React$cloneElement))
        );
      };

      return DialogWrapper;
    }(_react2.default.Component);
  }

  return (0, _redux.compose)((0, _reactRedux.connect)(function (_ref) {
    var tg_modalState = _ref.tg_modalState;

    return { tg_modalState: tg_modalState };
  }), (0, _recompose.lifecycle)({
    componentWillMount: function componentWillMount() {
      var _props3 = this.props,
          dispatch = _props3.dispatch,
          dialogName = _props3.dialogName;

      var uniqueName = (0, _uniqid2.default)();
      var nameToUse = dialogName || uniqueName;
      this.setState({
        nameToUse: nameToUse,
        uniqueName: uniqueName
      });
      if (dialogName) {
        dispatch({
          type: "TG_REGISTER_MODAL",
          name: dialogName,
          uniqueName: uniqueName
        });
      }
    }
  }), (0, _reactRedux.connect)(function (_ref2, _ref3) {
    var tg_modalState = _ref2.tg_modalState;
    var nameToUse = _ref3.nameToUse,
        uniqueName = _ref3.uniqueName;

    var dialogState = tg_modalState[nameToUse] || {};

    var open = dialogState.open,
        __registeredAs = dialogState.__registeredAs,
        rest = _objectWithoutProperties(dialogState, ["open", "__registeredAs"]);

    var newProps = _extends({}, rest, {
      isDialogOpen: open && (__registeredAs ? Object.keys(__registeredAs)[Object.keys(__registeredAs).length - 1] === uniqueName : true)
    });
    return newProps;
  }, function (dispatch, _ref4) {
    var nameToUse = _ref4.nameToUse,
        hideModal = _ref4.hideModal,
        showModal = _ref4.showModal;

    return {
      showModal: showModal || function () {
        dispatch({
          type: "TG_SHOW_MODAL",
          name: nameToUse
        });
      },
      hideModal: hideModal || function () {
        dispatch({
          type: "TG_HIDE_MODAL",
          name: nameToUse
        });
      }
    };
  }), dialogHoc);
}
module.exports = exports["default"];