import React from 'react'
import ReactDOM from 'react-dom'

import './style.css'

export default class Minimap extends React.PureComponent {
  static defaultProps = {
    zoom: 1
  }

  state = {
    viewportEl: null,
    minimapViewPortDragging: false
  }

  setMinimapBackgroundRef = node => {
    this.minimapBackgroundRef = node
  }

  setMinimapViewportRef = node => {
    this.minimapViewportRef = node
  }

  handleViewportScroll = () => {
    this.forceUpdate()
  }

  getScaleFromZoom = () => 1 / this.props.zoom

  componentDidMount() {
    const { minimapViewportSelector, minimapParentSelector } = this.props

    const viewportEl = document.querySelector(minimapViewportSelector)
    viewportEl.addEventListener('scroll', this.handleViewportScroll)

    const minimapParentEl = document.querySelector(minimapParentSelector)

    this.setState({
      viewportEl,
      minimapParentEl
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.zoom !== this.props.zoom) {
      // Keep middle point stationary when zooming
      const viewport = this.state.viewportEl
      const oldZoom = this.props.zoom
      const newZoom = nextProps.zoom

      const left = viewport.scrollLeft
      const hw = viewport.clientWidth / 2
      viewport.scrollLeft = (left + hw) * oldZoom / newZoom - hw

      const top = viewport.scrollTop
      const hh = viewport.clientHeight / 2
      viewport.scrollTop = (top + hh) * oldZoom / newZoom - hh
    }
  }

  componentWillUnmount() {
    const { viewportEl } = this.state

    if (viewportEl)
      viewportEl.removeEventListener('scroll', this.handleViewportScroll)
  }

  getScaleFactor = () => {
    const { rootRef, minimapThickness, isHorizontal } = this.props
    const { viewportEl } = this.state
    if (!rootRef || !viewportEl) return null

    const {
      height: treeHeight,
      width: treeWidth
    } = rootRef.getBoundingClientRect()

    const {
      height: viewportHeight,
      width: viewportWidth
    } = viewportEl.getBoundingClientRect()

    const zoomScale = this.getScaleFromZoom()

    return isHorizontal
      ? zoomScale *
          Math.min(minimapThickness / treeHeight, viewportWidth / treeWidth)
      : zoomScale *
          Math.min(minimapThickness / treeWidth, viewportHeight / treeHeight)
  }

  minimapBackgroundScrollToPosition = e => {
    const { minimapBackgroundRef } = this
    const { viewportEl } = this.state

    const {
      top: backgroundTop,
      left: backgroundLeft
    } = minimapBackgroundRef.getBoundingClientRect()

    const {
      height: viewportHeight,
      width: viewportWidth
    } = viewportEl.getBoundingClientRect()

    const scaleFactor = this.getScaleFactor()
    const zoomScale = this.getScaleFromZoom()

    const xOnBackground =
      (e.pageX - (backgroundLeft + window.scrollX)) * zoomScale / scaleFactor
    const yOnBackground =
      (e.pageY - (backgroundTop + window.scrollY)) * zoomScale / scaleFactor

    viewportEl.scrollLeft = xOnBackground - viewportWidth / 2
    viewportEl.scrollTop = yOnBackground - viewportHeight / 2
  }

  endMinimapDrag = () => {
    this.setState({ minimapViewPortDragging: false })
    this.lastMinimapViewportMouseX = null
    this.lastMinimapViewportMouseY = null
  }

  //////////////////////////////////////////////////
  // Minimap background event handlers /////////////
  //////////////////////////////////////////////////
  handleMinimapBackgroundMouseDown = e => {
    this.setState({ minimapViewPortDragging: true })
    this.lastMinimapViewportMouseX = e.clientX
    this.lastMinimapViewportMouseY = e.clientY
    this.minimapBackgroundScrollToPosition(e)
  }

  handleMinimapBackgroundMouseMove = e => {
    const { minimapViewPortDragging } = this.state
    if (!minimapViewPortDragging) return
    this.minimapBackgroundScrollToPosition(e)
    this.lastMinimapViewportMouseX = e.clientX
    this.lastMinimapViewportMouseY = e.clientY
  }

  handleMinimapBackgroundMouseUp = () => {
    this.endMinimapDrag()
  }

  handleMinimapBackgroundMouseLeave = e => {
    const { relatedTarget } = e
    const { minimapViewportRef } = this
    const { minimapViewPortDragging } = this.state
    if (minimapViewPortDragging && relatedTarget === minimapViewportRef) return
    this.endMinimapDrag()
  }

  //////////////////////////////////////////////////
  // Minimap viewport event handlers ///////////////
  //////////////////////////////////////////////////
  handleMinimapViewportMouseDown = e => {
    this.setState({ minimapViewPortDragging: true })
    this.lastMinimapViewportMouseX = e.clientX
    this.lastMinimapViewportMouseY = e.clientY

    e.preventDefault()
  }

  handleMinimapViewportMouseMove = e => {
    const { zoom } = this.props
    const { lastMinimapViewportMouseX, lastMinimapViewportMouseY } = this
    const { viewportEl, minimapViewPortDragging } = this.state
    if (!minimapViewPortDragging) return

    const deltaX = e.clientX - lastMinimapViewportMouseX
    const deltaY = e.clientY - lastMinimapViewportMouseY

    const scaleFactor = this.getScaleFactor()

    viewportEl.scrollTop += deltaY / scaleFactor / zoom
    viewportEl.scrollLeft += deltaX / scaleFactor / zoom

    this.lastMinimapViewportMouseX = e.clientX
    this.lastMinimapViewportMouseY = e.clientY
  }

  handleMinimapViewportMouseUp = () => {
    this.endMinimapDrag()
  }

  handleMinimapViewportMouseLeave = e => {
    const { relatedTarget } = e
    const { minimapBackgroundRef } = this
    const { minimapViewPortDragging } = this.state
    if (minimapViewPortDragging && relatedTarget === minimapBackgroundRef)
      return
    this.endMinimapDrag()
  }

  pxToNumber = s => Number(s.slice(0, -2))

  //////////////////////////////////////////////////
  // Render method /////////////////////////////////
  //////////////////////////////////////////////////
  render() {
    const {
      rootRef,
      children,
      isHorizontal,
      minimapThickness,
      zoom
    } = this.props
    const { viewportEl, minimapViewPortDragging, minimapParentEl } = this.state
    if (!viewportEl || !rootRef || !minimapParentEl) return null

    const {
      height: viewportHeight,
      width: viewportWidth,
      top: viewportTop,
      left: viewportLeft
    } = viewportEl.getBoundingClientRect()
    let {
      top: treeTop,
      left: treeLeft,
      height: treeHeight,
      width: treeWidth
    } = rootRef.getBoundingClientRect()
    treeWidth *= zoom
    treeHeight *= zoom

    const viewportComputedStyle = getComputedStyle(viewportEl)

    const scaleFactor = this.getScaleFactor()
    return ReactDOM.createPortal(
      <div
        className="tg-tree-minimap"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: isHorizontal ? scaleFactor * treeWidth : minimapThickness,
          height: isHorizontal ? minimapThickness : scaleFactor * treeHeight,
          // minWidth: 'min-content',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            transform: `scale(${scaleFactor})`,
            transformOrigin: 'top left',
            overflow: 'hidden',
            width: treeWidth,
            height: treeHeight
          }}
        >
          <div
            className="tg-tree-minimap-background"
            ref={this.setMinimapBackgroundRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: treeWidth,
              height: treeHeight
            }}
            onMouseDown={this.handleMinimapBackgroundMouseDown}
            onMouseMove={this.handleMinimapBackgroundMouseMove}
            onMouseUp={this.handleMinimapBackgroundMouseUp}
            onMouseLeave={this.handleMinimapBackgroundMouseLeave}
          />
          {children}
          <div
            className={
              'tg-tree-minimap-viewport ' +
              (minimapViewPortDragging
                ? 'tg-tree-minimap-viewport-dragging'
                : '')
            }
            ref={this.setMinimapViewportRef}
            style={{
              position: 'absolute',
              width: viewportWidth * zoom,
              height: viewportHeight * zoom,
              top:
                zoom *
                (viewportTop -
                  treeTop -
                  this.pxToNumber(
                    viewportComputedStyle.getPropertyValue('padding-top')
                  )),
              left:
                zoom *
                (viewportLeft -
                  treeLeft -
                  this.pxToNumber(
                    viewportComputedStyle.getPropertyValue('padding-left')
                  ))
            }}
            onMouseDown={this.handleMinimapViewportMouseDown}
            onMouseMove={this.handleMinimapViewportMouseMove}
            onMouseUp={this.handleMinimapViewportMouseUp}
            onMouseLeave={this.handleMinimapViewportMouseLeave}
          />
        </div>
      </div>,
      minimapParentEl
    )
  }
}
