const visit = require('unist-util-visit')
const toText = require('hast-util-to-text')
const renderer = require('./renderer/svg')

module.exports = rehypeMathJaxSvg

function rehypeMathJaxSvg(options = {}) {
  return transformMath

  function transformMath(tree) {
    const transform = renderer(options)

    let found = false

    visit(tree, 'element', onelement)

    if (found) {
      tree.children.push(transform.styleSheet())
    }

    function onelement(element) {
      const classes = element.properties.className || []
      const inline = classes.includes('math-inline')
      const display = classes.includes('math-display')

      if (!inline && !display) {
        return
      }

      found = true
      element.children = [transform.render(toText(element), {display: display})]

      return visit.SKIP
    }
  }
}
