const visit = require('unist-util-visit')
const toText = require('hast-util-to-text')
const NoneRenderer = require('./renderer/none')

module.exports = rehypeMathJaxNone

function rehypeMathJaxNone(options) {
  const renderer = new NoneRenderer({
    displayMath: ['\\[', '\\]'],
    inlineMath: ['\\(', '\\)'],
    ...options
  })

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

      element.children = [renderer.render(toText(element), {display: display})]

      return visit.SKIP
    }
  }
}
