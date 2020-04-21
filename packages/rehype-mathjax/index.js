const visit = require('unist-util-visit')
const toText = require('hast-util-to-text')
const {SVGRenderer, CHTMLRenderer} = require('./renderer')

module.exports = rehypeMathJax

function rehypeMathJax(output, options = {}) {
  return transformMath

  function transformMath(tree) {
    let renderer
    switch (output) {
      case 'chtml':
        renderer = new CHTMLRenderer(options)
        break
      case 'svg':
        renderer = new SVGRenderer(options)
        break
      default:
        throw new Error(`'${output}' is neither 'chtml' nor 'svg'`)
    }

    let found = false

    visit(tree, 'element', onelement)

    if (found) {
      tree.children.push(renderer.styleSheet)
    }

    function onelement(element) {
      const classes = element.properties.className || []
      const inline = classes.includes('math-inline')
      const display = classes.includes('math-display')

      if (!inline && !display) {
        return
      }

      found = true
      element.children = [renderer.render(toText(element), {display: display})]

      return visit.SKIP
    }
  }
}
