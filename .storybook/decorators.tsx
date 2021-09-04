import React from 'react'
import { HashRouter } from 'react-router-dom'

export default [
  (Story) => (
    <HashRouter>
      <Story />
    </HashRouter>
  ),
]
