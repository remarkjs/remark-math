const visit = require('unist-util-visit')
const toText = require('hast-util-to-text')
const renderer = require('./renderer')

module.exports = () => {
  return (tree) => {
    var found = false
    visit(tree, 'element', (element) => {
      const classes = element.properties.className || []
      const inline = classes.includes('math-inline')
      const display = classes.includes('math-display')
      if (!inline && !display) {
        return
      }

      found = true
      element.children = [renderer.render(toText(element), {display})]
    })
    if (found) {
      tree.children.push(renderer.stylesheet())
    }
  }
}
