const inlinePlugin = require('./inline')
const blockPlugin = require('./block')

module.exports = function plugin (p, opts = {}) {
  inlinePlugin(p, opts)
  blockPlugin(p, opts)
}
