var _class, _temp2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

var Minimap = (_temp2 = _class = function (_React$PureComponent) {
  _inherits(Minimap, _React$PureComponent);

  function Minimap() {
    var _temp, _this, _ret;

    _classCallCheck(this, Minimap);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args))), _this), _this.state = {
      viewportEl: null,
      minimapViewPortDragging: false
    }, _this.setMinimapBackgroundRef = function (node) {
      _this.minimapBackgroundRef = node;
    }, _this.setMinimapViewportRef = function (node) {
      _this.minimapViewportRef = node;
    }, _this.handleViewportScroll = function () {
      _this.forceUpdate();
    }, _this.getScaleFromZoom = function () {
      return 1 / _this.props.zoom;
    }, _this.getScaleFactor = function () {
      var _this$props = _this.props,
          rootRef = _this$props.rootRef,
          minimapThickness = _this$props.minimapThickness,
          isHorizontal = _this$props.isHorizontal;
      var viewportEl = _this.state.viewportEl;

      if (!rootRef || !viewportEl) return null;

      var _rootRef$getBoundingC = rootRef.getBoundingClientRect(),
          treeHeight = _rootRef$getBoundingC.height,
          treeWidth = _rootRef$getBoundingC.width;

      var _viewportEl$getBoundi = viewportEl.getBoundingClientRect(),
          viewportHeight = _viewportEl$getBoundi.height,
          viewportWidth = _viewportEl$getBoundi.width;

      var zoomScale = _this.getScaleFromZoom();

      return isHorizontal ? zoomScale * Math.min(minimapThickness / treeHeight, viewportWidth / treeWidth) : zoomScale * Math.min(minimapThickness / treeWidth, viewportHeight / treeHeight);
    }, _this.minimapBackgroundScrollToPosition = function (e) {
      var _this2 = _this,
          minimapBackgroundRef = _this2.minimapBackgroundRef;
      var viewportEl = _this.state.viewportEl;

      var _minimapBackgroundRef = minimapBackgroundRef.getBoundingClientRect(),
          backgroundTop = _minimapBackgroundRef.top,
          backgroundLeft = _minimapBackgroundRef.left;

      var _viewportEl$getBoundi2 = viewportEl.getBoundingClientRect(),
          viewportHeight = _viewportEl$getBoundi2.height,
          viewportWidth = _viewportEl$getBoundi2.width;

      var scaleFactor = _this.getScaleFactor();
      var zoomScale = _this.getScaleFromZoom();

      var xOnBackground = (e.pageX - (backgroundLeft + window.scrollX)) * zoomScale / scaleFactor;
      var yOnBackground = (e.pageY - (backgroundTop + window.scrollY)) * zoomScale / scaleFactor;

      viewportEl.scrollLeft = xOnBackground - viewportWidth / 2;
      viewportEl.scrollTop = yOnBackground - viewportHeight / 2;
    }, _this.endMinimapDrag = function () {
      _this.setState({ minimapViewPortDragging: false });
      _this.lastMinimapViewportMouseX = null;
      _this.lastMinimapViewportMouseY = null;
    }, _this.handleMinimapBackgroundMouseDown = function (e) {
      _this.setState({ minimapViewPortDragging: true });
      _this.lastMinimapViewportMouseX = e.clientX;
      _this.lastMinimapViewportMouseY = e.clientY;
      _this.minimapBackgroundScrollToPosition(e);
    }, _this.handleMinimapBackgroundMouseMove = function (e) {
      var minimapViewPortDragging = _this.state.minimapViewPortDragging;

      if (!minimapViewPortDragging) return;
      _this.minimapBackgroundScrollToPosition(e);
      _this.lastMinimapViewportMouseX = e.clientX;
      _this.lastMinimapViewportMouseY = e.clientY;
    }, _this.handleMinimapBackgroundMouseUp = function () {
      _this.endMinimapDrag();
    }, _this.handleMinimapBackgroundMouseLeave = function (e) {
      var relatedTarget = e.relatedTarget;
      var _this3 = _this,
          minimapViewportRef = _this3.minimapViewportRef;
      var minimapViewPortDragging = _this.state.minimapViewPortDragging;

      if (minimapViewPortDragging && relatedTarget === minimapViewportRef) return;
      _this.endMinimapDrag();
    }, _this.handleMinimapViewportMouseDown = function (e) {
      _this.setState({ minimapViewPortDragging: true });
      _this.lastMinimapViewportMouseX = e.clientX;
      _this.lastMinimapViewportMouseY = e.clientY;

      e.preventDefault();
    }, _this.handleMinimapViewportMouseMove = function (e) {
      var zoom = _this.props.zoom;
      var _this4 = _this,
          lastMinimapViewportMouseX = _this4.lastMinimapViewportMouseX,
          lastMinimapViewportMouseY = _this4.lastMinimapViewportMouseY;
      var _this$state = _this.state,
          viewportEl = _this$state.viewportEl,
          minimapViewPortDragging = _this$state.minimapViewPortDragging;

      if (!minimapViewPortDragging) return;

      var deltaX = e.clientX - lastMinimapViewportMouseX;
      var deltaY = e.clientY - lastMinimapViewportMouseY;

      var scaleFactor = _this.getScaleFactor();

      viewportEl.scrollTop += deltaY / scaleFactor / zoom;
      viewportEl.scrollLeft += deltaX / scaleFactor / zoom;

      _this.lastMinimapViewportMouseX = e.clientX;
      _this.lastMinimapViewportMouseY = e.clientY;
    }, _this.handleMinimapViewportMouseUp = function () {
      _this.endMinimapDrag();
    }, _this.handleMinimapViewportMouseLeave = function (e) {
      var relatedTarget = e.relatedTarget;
      var _this5 = _this,
          minimapBackgroundRef = _this5.minimapBackgroundRef;
      var minimapViewPortDragging = _this.state.minimapViewPortDragging;

      if (minimapViewPortDragging && relatedTarget === minimapBackgroundRef) return;
      _this.endMinimapDrag();
    }, _this.pxToNumber = function (s) {
      return Number(s.slice(0, -2));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Minimap.prototype.componentDidMount = function componentDidMount() {
    var _props = this.props,
        minimapViewportSelector = _props.minimapViewportSelector,
        minimapParentSelector = _props.minimapParentSelector;


    var viewportEl = document.querySelector(minimapViewportSelector);
    viewportEl.addEventListener('scroll', this.handleViewportScroll);

    var minimapParentEl = document.querySelector(minimapParentSelector);

    this.setState({
      viewportEl: viewportEl,
      minimapParentEl: minimapParentEl
    });
  };

  Minimap.prototype.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.zoom !== this.props.zoom) {
      // Keep middle point stationary when zooming
      var viewport = this.state.viewportEl;
      var oldZoom = this.props.zoom;
      var newZoom = nextProps.zoom;

      var left = viewport.scrollLeft;
      var hw = viewport.clientWidth / 2;
      viewport.scrollLeft = (left + hw) * oldZoom / newZoom - hw;

      var top = viewport.scrollTop;
      var hh = viewport.clientHeight / 2;
      viewport.scrollTop = (top + hh) * oldZoom / newZoom - hh;
    }
  };

  Minimap.prototype.componentWillUnmount = function componentWillUnmount() {
    var viewportEl = this.state.viewportEl;


    if (viewportEl) viewportEl.removeEventListener('scroll', this.handleViewportScroll);
  };

  //////////////////////////////////////////////////
  // Minimap background event handlers /////////////
  //////////////////////////////////////////////////


  //////////////////////////////////////////////////
  // Minimap viewport event handlers ///////////////
  //////////////////////////////////////////////////


  //////////////////////////////////////////////////
  // Render method /////////////////////////////////
  //////////////////////////////////////////////////
  Minimap.prototype.render = function render() {
    var _props2 = this.props,
        rootRef = _props2.rootRef,
        children = _props2.children,
        isHorizontal = _props2.isHorizontal,
        minimapThickness = _props2.minimapThickness,
        zoom = _props2.zoom;
    var _state = this.state,
        viewportEl = _state.viewportEl,
        minimapViewPortDragging = _state.minimapViewPortDragging,
        minimapParentEl = _state.minimapParentEl;

    if (!viewportEl || !rootRef || !minimapParentEl) return null;

    var _viewportEl$getBoundi3 = viewportEl.getBoundingClientRect(),
        viewportHeight = _viewportEl$getBoundi3.height,
        viewportWidth = _viewportEl$getBoundi3.width,
        viewportTop = _viewportEl$getBoundi3.top,
        viewportLeft = _viewportEl$getBoundi3.left;

    var _rootRef$getBoundingC2 = rootRef.getBoundingClientRect(),
        treeTop = _rootRef$getBoundingC2.top,
        treeLeft = _rootRef$getBoundingC2.left,
        treeHeight = _rootRef$getBoundingC2.height,
        treeWidth = _rootRef$getBoundingC2.width;

    treeWidth *= zoom;
    treeHeight *= zoom;

    var viewportComputedStyle = getComputedStyle(viewportEl);

    var scaleFactor = this.getScaleFactor();
    return ReactDOM.createPortal(React.createElement(
      'div',
      {
        className: 'tg-tree-minimap',
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: isHorizontal ? scaleFactor * treeWidth : minimapThickness,
          height: isHorizontal ? minimapThickness : scaleFactor * treeHeight,
          // minWidth: 'min-content',
          overflow: 'hidden'
        }
      },
      React.createElement(
        'div',
        {
          style: {
            transform: 'scale(' + scaleFactor + ')',
            transformOrigin: 'top left',
            overflow: 'hidden',
            width: treeWidth,
            height: treeHeight
          }
        },
        React.createElement('div', {
          className: 'tg-tree-minimap-background',
          ref: this.setMinimapBackgroundRef,
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: treeWidth,
            height: treeHeight
          },
          onMouseDown: this.handleMinimapBackgroundMouseDown,
          onMouseMove: this.handleMinimapBackgroundMouseMove,
          onMouseUp: this.handleMinimapBackgroundMouseUp,
          onMouseLeave: this.handleMinimapBackgroundMouseLeave
        }),
        children,
        React.createElement('div', {
          className: 'tg-tree-minimap-viewport ' + (minimapViewPortDragging ? 'tg-tree-minimap-viewport-dragging' : ''),
          ref: this.setMinimapViewportRef,
          style: {
            position: 'absolute',
            width: viewportWidth * zoom,
            height: viewportHeight * zoom,
            top: zoom * (viewportTop - treeTop - this.pxToNumber(viewportComputedStyle.getPropertyValue('padding-top'))),
            left: zoom * (viewportLeft - treeLeft - this.pxToNumber(viewportComputedStyle.getPropertyValue('padding-left')))
          },
          onMouseDown: this.handleMinimapViewportMouseDown,
          onMouseMove: this.handleMinimapViewportMouseMove,
          onMouseUp: this.handleMinimapViewportMouseUp,
          onMouseLeave: this.handleMinimapViewportMouseLeave
        })
      )
    ), minimapParentEl);
  };

  return Minimap;
}(React.PureComponent), _class.defaultProps = {
  zoom: 1
}, _temp2);
export { Minimap as default };