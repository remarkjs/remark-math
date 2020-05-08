const visit = require('unist-util-visit')
const toText = require('hast-util-to-text')

module.exports = createPlugin

function createPlugin(displayName, createRenderer) {
  attacher.displayName = displayName

  return attacher

  function attacher(options = {}) {
    const renderer = createRenderer(options)

    transform.displayName = displayName + 'Transform'

    return transform

    function transform(tree) {
      let found = false

      visit(tree, 'element', onelement)

      if (found && renderer.styleSheet) {
        tree.children.push(renderer.styleSheet())
      }

      function onelement(element) {
        const classes = element.properties.className || []
        const inline = classes.includes('math-inline')
        const display = classes.includes('math-display')

        if (!inline && !display) {
          return
        }

        found = true
        element.children = [
          renderer.render(toText(element), {display: display})
        ]

        return visit.SKIP
      }
    }
  }
}
