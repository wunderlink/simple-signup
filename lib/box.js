var h = require('hyperscript')
var renderForm = require('./form')
var defaultStyles = require('./styles')

module.exports = function renderBox (opts) {
  var styles = opts.styles === false ? {} : defaultStyles

  return h('.ss-box', {style: styles.box},
    h('h4.ss-title', {style: styles.title}, opts.title),
    renderForm(opts),
    renderLinks(opts.links, styles)
  )
}

function renderLinks (links, styles) {
  if (!links) return ''

  return h('.ss-links', {style: styles.links},
    h('a', { href: links[0].href, style: styles.link}, links[0].text),
    ' · ',
    h('a', { href: links[1].href, style: styles.link }, links[1].text)
  )
}
