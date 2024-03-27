import React from './React'

const ReactDom = {
  createRoot (root) {
    return {
      render (app) {
        React.render(app, root)
      }
    }
  }
}

export default ReactDom
