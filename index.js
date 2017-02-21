const inlineParser = require('./inlineParser')
const blockParser = require('./blockParser')

module.exports = function plugin (p, opts = {}) {
  inlineParser(p, opts)
  blockParser(p, opts)
}
