const inlinePlugin = require('./inline')
const blockPlugin = require('./block')

module.exports = function plugin (opts = {}) {
  inlinePlugin.apply(this, opts)
  blockPlugin.apply(this, opts)
}
