const visit = require('unist-util-visit')
const toText = require('hast-util-to-text')
const renderer = require('./renderer/browser')

module.exports = rehypeMathJaxBrowser

function rehypeMathJaxBrowser(options) {
  var render = renderer({
    displayMath: ['\\[', '\\]'],
    inlineMath: ['\\(', '\\)'],
    ...options
  }).render

  return transformMath

  function transformMath(tree) {
    visit(tree, 'element', onelement)

    function onelement(element) {
      const classes = element.properties.className || []
      const inline = classes.includes('math-inline')
      const display = classes.includes('math-display')

      if (!inline && !display) {
        return
      }

      element.children = [render(toText(element), {display: display})]

      return visit.SKIP
    }
  }
}
