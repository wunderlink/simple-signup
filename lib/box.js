var h = require('hyperscript')
var renderForm = require('./form')

module.exports = function renderBox (opts) {
  return h('.ss-box', boxOpts,
    h('h4.ss-title', titleOpts, opts.title),
    renderForm(opts),
    h('.ss-links', opts.links)
  )
}

var boxOpts = {
  style: {
    'background': '#fff',
    'font-family': 'sans-serif',
    'font-size': '16px',
    'padding': '15px 50px 50px',
    'border-radius': '2px',
    'width': '400px',
    'margin': '100px auto 50px',
    'text-align': 'center',
    'box-shadow': '0 14px 45px rgba(0, 0, 0, 0.25), 0 10px 18px rgba(0, 0, 0, 0.22)'
  }
}

var titleOpts = {
  style: {
    
  }
}

