import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import DataTable from 'src/'

describe('DataTable', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('displays a welcome message', () => {
    render(<DataTable/>, node, () => {
      expect(true).toBe('true')
      // expect(node.innerHTML).toContain('Welcome to React components')
    })
  })
})
