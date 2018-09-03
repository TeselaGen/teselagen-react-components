import { createElement, Component } from 'react';
import Draggable from 'react-draggable';
import Resizable from 're-resizable';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

var resizableStyle = {
    width: "auto",
    height: "auto",
    display: "inline-block",
    position: "absolute",
    top: 0,
    left: 0,
};
var Rnd = /** @class */ (function (_super) {
    __extends(Rnd, _super);
    function Rnd(props) {
        var _this = _super.call(this, props) || this;
        _this.isResizing = false;
        _this.state = {
            original: {
                x: 0,
                y: 0,
            },
            bounds: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
            maxWidth: props.maxWidth,
            maxHeight: props.maxHeight,
        };
        _this.onResizeStart = _this.onResizeStart.bind(_this);
        _this.onResize = _this.onResize.bind(_this);
        _this.onResizeStop = _this.onResizeStop.bind(_this);
        _this.onDragStart = _this.onDragStart.bind(_this);
        _this.onDrag = _this.onDrag.bind(_this);
        _this.onDragStop = _this.onDragStop.bind(_this);
        _this.getMaxSizesFromProps = _this.getMaxSizesFromProps.bind(_this);
        return _this;
    }
    Rnd.prototype.componentDidMount = function () {
        var _a = this.getOffsetFromParent(), left = _a.left, top = _a.top;
        var _b = this.getDraggablePosition(), x = _b.x, y = _b.y;
        this.draggable.setState({
            x: x - left,
            y: y - top,
        });
        // HACK: Apply position adjustment
        this.forceUpdate();
    };
    // HACK: To get `react-draggable` state x and y.
    Rnd.prototype.getDraggablePosition = function () {
        var _a = this.draggable.state, x = _a.x, y = _a.y;
        return { x: x, y: y };
    };
    Rnd.prototype.getParent = function () {
        return this.resizable && this.resizable.parentNode;
    };
    Rnd.prototype.getParentSize = function () {
        return this.resizable.getParentSize();
    };
    Rnd.prototype.getMaxSizesFromProps = function () {
        var maxWidth = typeof this.props.maxWidth === "undefined" ? Number.MAX_SAFE_INTEGER : this.props.maxWidth;
        var maxHeight = typeof this.props.maxHeight === "undefined" ? Number.MAX_SAFE_INTEGER : this.props.maxHeight;
        return { maxWidth: maxWidth, maxHeight: maxHeight };
    };
    Rnd.prototype.getSelfElement = function () {
        return this.resizable && this.resizable.resizable;
    };
    Rnd.prototype.onDragStart = function (e, data) {
        if (this.props.onDragStart) {
            this.props.onDragStart(e, data);
        }
        if (!this.props.bounds)
            return;
        var parent = this.getParent();
        var boundary;
        if (this.props.bounds === "parent") {
            boundary = parent;
        }
        else if (this.props.bounds === "body") {
            boundary = document.body;
        }
        else if (this.props.bounds === "window") {
            if (!this.resizable)
                return;
            return this.setState({
                bounds: {
                    top: 0,
                    right: window.innerWidth - this.resizable.size.width,
                    bottom: window.innerHeight - this.resizable.size.height,
                    left: 0,
                },
            });
        }
        else {
            boundary = document.querySelector(this.props.bounds);
        }
        if (!(boundary instanceof HTMLElement) || !(parent instanceof HTMLElement)) {
            return;
        }
        var boundaryRect = boundary.getBoundingClientRect();
        var boundaryLeft = boundaryRect.left;
        var boundaryTop = boundaryRect.top;
        var parentRect = parent.getBoundingClientRect();
        var parentLeft = parentRect.left;
        var parentTop = parentRect.top;
        var left = boundaryLeft - parentLeft;
        var top = boundaryTop - parentTop;
        if (!this.resizable)
            return;
        var offset = this.getOffsetFromParent();
        this.setState({
            bounds: {
                top: top - offset.top,
                right: left + (boundary.offsetWidth - this.resizable.size.width) - offset.left,
                bottom: top + (boundary.offsetHeight - this.resizable.size.height) - offset.top,
                left: left - offset.left,
            },
        });
    };
    Rnd.prototype.onDrag = function (e, data) {
        if (this.props.onDrag) {
            var offset = this.getOffsetFromParent();
            this.props.onDrag(e, __assign({}, data, { x: data.x - offset.left, y: data.y - offset.top }));
        }
    };
    Rnd.prototype.onDragStop = function (e, data) {
        if (this.props.onDragStop) {
            var _a = this.getOffsetFromParent(), left = _a.left, top_1 = _a.top;
            this.props.onDragStop(e, __assign({}, data, { x: data.x + left, y: data.y + top_1 }));
        }
    };
    Rnd.prototype.onResizeStart = function (e, dir, elementRef) {
        e.stopPropagation();
        this.isResizing = true;
        this.setState({
            original: this.getDraggablePosition(),
        });
        if (this.props.bounds) {
            var parent_1 = this.getParent();
            var boundary = void 0;
            if (this.props.bounds === "parent") {
                boundary = parent_1;
            }
            else if (this.props.bounds === "body") {
                boundary = document.body;
            }
            else if (this.props.bounds === "window") {
                boundary = window;
            }
            else {
                boundary = document.querySelector(this.props.bounds);
            }
            var self_1 = this.getSelfElement();
            if (self_1 instanceof Element &&
                (boundary instanceof HTMLElement || boundary === window) &&
                parent_1 instanceof HTMLElement) {
                var _a = this.getMaxSizesFromProps(), maxWidth = _a.maxWidth, maxHeight = _a.maxHeight;
                var parentSize = this.getParentSize();
                if (maxWidth && typeof maxWidth === "string") {
                    if (maxWidth.endsWith("%")) {
                        var ratio = Number(maxWidth.replace("%", "")) / 100;
                        maxWidth = parentSize.width * ratio;
                    }
                    else if (maxWidth.endsWith("px")) {
                        maxWidth = Number(maxWidth.replace("px", ""));
                    }
                }
                if (maxHeight && typeof maxHeight === "string") {
                    if (maxHeight.endsWith("%")) {
                        var ratio = Number(maxHeight.replace("%", "")) / 100;
                        maxHeight = parentSize.width * ratio;
                    }
                    else if (maxHeight.endsWith("px")) {
                        maxHeight = Number(maxHeight.replace("px", ""));
                    }
                }
                var selfRect = self_1.getBoundingClientRect();
                var selfLeft = selfRect.left;
                var selfTop = selfRect.top;
                var boundaryRect = this.props.bounds === "window" ? { left: 0, top: 0 } : boundary.getBoundingClientRect();
                var boundaryLeft = boundaryRect.left;
                var boundaryTop = boundaryRect.top;
                var offsetWidth = this.props.bounds === "window" ? window.innerWidth : boundary.offsetWidth;
                var offsetHeight = this.props.bounds === "window" ? window.innerHeight : boundary.offsetHeight;
                var hasLeft = dir.toLowerCase().endsWith("left");
                var hasRight = dir.toLowerCase().endsWith("right");
                var hasTop = dir.startsWith("top");
                var hasBottom = dir.startsWith("bottom");
                if (hasLeft && this.resizable) {
                    var max = selfLeft - boundaryLeft + this.resizable.size.width;
                    this.setState({ maxWidth: max > Number(maxWidth) ? maxWidth : max });
                }
                // INFO: To set bounds in `lock aspect ratio with bounds` case. See also that story.
                if (hasRight || (this.props.lockAspectRatio && !hasLeft)) {
                    var max = offsetWidth + (boundaryLeft - selfLeft);
                    this.setState({ maxWidth: max > Number(maxWidth) ? maxWidth : max });
                }
                if (hasTop && this.resizable) {
                    var max = selfTop - boundaryTop + this.resizable.size.height;
                    this.setState({
                        maxHeight: max > Number(maxHeight) ? maxHeight : max,
                    });
                }
                // INFO: To set bounds in `lock aspect ratio with bounds` case. See also that story.
                if (hasBottom || (this.props.lockAspectRatio && !hasTop)) {
                    var max = offsetHeight + (boundaryTop - selfTop);
                    this.setState({
                        maxHeight: max > Number(maxHeight) ? maxHeight : max,
                    });
                }
            }
        }
        else {
            this.setState({
                maxWidth: this.props.maxWidth,
                maxHeight: this.props.maxHeight,
            });
        }
        if (this.props.onResizeStart) {
            this.props.onResizeStart(e, dir, elementRef);
        }
    };
    Rnd.prototype.onResize = function (e, direction, elementRef, delta) {
        var x;
        var y;
        var offset = this.getOffsetFromParent();
        if (/left/i.test(direction)) {
            x = this.state.original.x - delta.width;
            // INFO: If uncontrolled component, apply x position by resize to draggable.
            if (!this.props.position) {
                this.draggable.setState({ x: x });
            }
            x += offset.left;
        }
        if (/top/i.test(direction)) {
            y = this.state.original.y - delta.height;
            // INFO: If uncontrolled component, apply y position by resize to draggable.
            if (!this.props.position) {
                this.draggable.setState({ y: y });
            }
            y += offset.top;
        }
        if (this.props.onResize) {
            if (typeof x === "undefined") {
                x = this.getDraggablePosition().x + offset.left;
            }
            if (typeof y === "undefined") {
                y = this.getDraggablePosition().y + offset.top;
            }
            this.props.onResize(e, direction, elementRef, delta, {
                x: x,
                y: y,
            });
        }
    };
    Rnd.prototype.onResizeStop = function (e, direction, elementRef, delta) {
        this.isResizing = false;
        var _a = this.getMaxSizesFromProps(), maxWidth = _a.maxWidth, maxHeight = _a.maxHeight;
        this.setState({ maxWidth: maxWidth, maxHeight: maxHeight });
        if (this.props.onResizeStop) {
            var position = this.getDraggablePosition();
            this.props.onResizeStop(e, direction, elementRef, delta, position);
        }
    };
    Rnd.prototype.updateSize = function (size) {
        if (!this.resizable)
            return;
        this.resizable.updateSize({ width: size.width, height: size.height });
    };
    Rnd.prototype.updatePosition = function (position) {
        this.draggable.setState(position);
    };
    Rnd.prototype.getOffsetFromParent = function () {
        var parent = this.getParent();
        if (!parent) {
            return {
                top: 0,
                left: 0,
            };
        }
        var parentRect = parent.getBoundingClientRect();
        var parentLeft = parentRect.left;
        var parentTop = parentRect.top;
        var selfRect = this.getSelfElement().getBoundingClientRect();
        var position = this.getDraggablePosition();
        return {
            left: selfRect.left - parentLeft - position.x,
            top: selfRect.top - parentTop - position.y,
        };
    };
    Rnd.prototype.render = function () {
        var _this = this;
        var _a = this.props, disableDragging = _a.disableDragging, style = _a.style, dragHandleClassName = _a.dragHandleClassName, position = _a.position, onMouseDown = _a.onMouseDown, dragAxis = _a.dragAxis, dragGrid = _a.dragGrid, bounds = _a.bounds, enableUserSelectHack = _a.enableUserSelectHack, cancel = _a.cancel, children = _a.children, onResizeStart = _a.onResizeStart, onResize = _a.onResize, onResizeStop = _a.onResizeStop, onDragStart = _a.onDragStart, onDrag = _a.onDrag, onDragStop = _a.onDragStop, resizeHandleStyles = _a.resizeHandleStyles, resizeHandleClasses = _a.resizeHandleClasses, enableResizing = _a.enableResizing, resizeGrid = _a.resizeGrid, resizableProps = __rest(_a, ["disableDragging", "style", "dragHandleClassName", "position", "onMouseDown", "dragAxis", "dragGrid", "bounds", "enableUserSelectHack", "cancel", "children", "onResizeStart", "onResize", "onResizeStop", "onDragStart", "onDrag", "onDragStop", "resizeHandleStyles", "resizeHandleClasses", "enableResizing", "resizeGrid"]);
        var defaultValue = this.props.default ? __assign({}, this.props.default) : undefined;
        // Remove unknown props, see also https://reactjs.org/warnings/unknown-prop.html
        delete resizableProps.default;
        var cursorStyle = disableDragging || dragHandleClassName ? { cursor: "normal" } : { cursor: "move" };
        var innerStyle = __assign({}, resizableStyle, cursorStyle, style);
        var _b = this.getOffsetFromParent(), left = _b.left, top = _b.top;
        var draggablePosition;
        if (position) {
            draggablePosition = {
                x: position.x - left,
                y: position.y - top,
            };
        }
        return (createElement(Draggable, { ref: function (c) {
                if (c) {
                    _this.draggable = c;
                }
            }, handle: dragHandleClassName ? "." + dragHandleClassName : undefined, defaultPosition: defaultValue, onMouseDown: onMouseDown, onStart: this.onDragStart, onDrag: this.onDrag, onStop: this.onDragStop, axis: dragAxis, disabled: disableDragging, grid: dragGrid, bounds: bounds ? this.state.bounds : undefined, position: draggablePosition, enableUserSelectHack: enableUserSelectHack, cancel: cancel },
            createElement(Resizable, __assign({}, resizableProps, { ref: function (c) {
                    if (c) {
                        _this.resizable = c;
                    }
                }, defaultSize: defaultValue, size: this.props.size, enable: enableResizing, onResizeStart: this.onResizeStart, onResize: this.onResize, onResizeStop: this.onResizeStop, style: innerStyle, minWidth: this.props.minWidth, minHeight: this.props.minHeight, maxWidth: this.isResizing ? this.state.maxWidth : this.props.maxWidth, maxHeight: this.isResizing ? this.state.maxHeight : this.props.maxHeight, grid: resizeGrid, handleWrapperClass: this.props.resizeHandleWrapperClass, handleWrapperStyle: this.props.resizeHandleWrapperStyle, lockAspectRatio: this.props.lockAspectRatio, lockAspectRatioExtraWidth: this.props.lockAspectRatioExtraWidth, lockAspectRatioExtraHeight: this.props.lockAspectRatioExtraHeight, handleStyles: resizeHandleStyles, handleClasses: resizeHandleClasses }), children)));
    };
    Rnd.defaultProps = {
        maxWidth: Number.MAX_SAFE_INTEGER,
        maxHeight: Number.MAX_SAFE_INTEGER,
        onResizeStart: function () { },
        onResize: function () { },
        onResizeStop: function () { },
        onDragStart: function () { },
        onDrag: function () { },
        onDragStop: function () { },
    };
    return Rnd;
}(Component));

export default Rnd;
