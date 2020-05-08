const visit = require('unist-util-visit')

module.exports = createPlugin

function createPlugin(displayName, createRenderer) {
  attacher.displayName = displayName

  return attacher

  function attacher(options) {
    const renderer = createRenderer(options)

    transform.displayName = displayName + 'Transform'

    return transform

    function transform(tree) {
      let found = false

      visit(tree, 'element', onelement)

      if (found && renderer.styleSheet) {
        tree.children.push(renderer.styleSheet())
      }

      function onelement(node) {
        const classes = node.properties.className || []
        const inline = classes.includes('math-inline')
        const display = classes.includes('math-display')

        if (!inline && !display) {
          return
        }

        found = true
        renderer.render(node, {display: display})

        return visit.SKIP
      }
    }
  }
}
