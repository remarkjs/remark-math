const JsDom = require('jsdom').JSDOM
const adaptor = require('mathjax-full/js/adaptors/jsdomAdaptor').jsdomAdaptor
const register = require('mathjax-full/js/handlers/html').RegisterHTMLHandler

module.exports = createAdaptor

function createAdaptor() {
  return adaptor(JsDom)
}
