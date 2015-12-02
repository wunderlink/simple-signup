
var h = require('hyperscript')
var Authentic = require('authentic-client')
var xtend = require('xtend')
var Wildemitter = require('wildemitter')

var ls = window.localStorage

var keyPrefix = 'ss_'


var SimpleSignup = module.exports = function (opts) {
  if (!(this instanceof SimpleSignup)) return new SimpleSignup(opts)
  this.auth = Authentic(opts)
  this.on('authToken', this.set.bind(this, 'authToken'))
  this.on('email', this.set.bind(this, 'email'))
}

Wildemitter.mixin(SimpleSignup)

SimpleSignup.prototype.authToken = function () {
  return this.auth.authToken
}


SimpleSignup.prototype.signup = function (emailOpts) {
  var auth = this.auth

  var fields = [
    {
      label: 'Email',
      property: 'email'
    },
    {
      label: 'Password',
      property: 'password',
      type: 'password'
    }
  ]

  var el = document.createElement('div')

  var opts = {
    action:'Signup',
    fields: fields,
    onSubmit: onSubmit
  }

  var form = renderForm(opts)
  el.appendChild(form)

  function onSubmit (formState) {
    auth.signup(xtend(emailOpts, formState), function (err, result) {
      el.innerHTML = ''
      if (err) {
        opts.error = err.message
        opts.state = formState
        var form = renderForm(opts)
        el.appendChild(form)
        return
      }

      el.appendChild(renderSignupComplete())
    })
  }

  return el
}

SimpleSignup.prototype.confirm = function (opts) {
  var self = this
  var el = document.createElement('div')
  el.innerHTML = 'loading...'

  console.log("Conf Opts", opts)

  this.auth.confirm(opts, function (err, result) {
    if (err) {
      el.innerHTML = err.message
      return
    }

    el.innerHTML = result.message
  })

  return el
}

SimpleSignup.prototype.set = function (key, val) {
  var lsKey = keyPrefix + key 
  console.log("EMITTED", key, val)
  if (typeof val !== "undefined" && val !== null) {
    ls.setItem(lsKey, JSON.stringify(val))
  } else {
    ls.removeItem(lsKey)
  }
  this.emit(key, val)
  return val 
}

SimpleSignup.prototype.get = function (key) {
  var lsKey = keyPrefix + key 
  var str = ls.getItem(lsKey) || 'null'
  return JSON.parse(str)
}




function renderSignupComplete () {
  var el = h('div',
    'Signup complete! Check your email for the confirmation link')
  return el
}

function renderForm (opts) {
  var formState = opts.state || {}

  var action = opts.action
  var fields = opts.fields
  var onSubmit = opts.onSubmit

  var fieldEls = fields.map( function (field) {
    return h('div',
      h('label.'+field.property,
        field.label,
        h('input.'+field.property, {
          type: field.type,
          value: formState[field.property] || '',
          onkeyup: function (evt) {
            formState[field.property] = evt.target.value
          }
        })))
  })

  var el = h.apply(null, [
    'form',
    h('h1', action)
  ].concat(
    fieldEls, [
    h('div.error', opts.error),
    h('input.signup-btn', 
      {type:'submit',
      onclick: function (evt) {
        onSubmit(formState)
        evt.preventDefault()
      }}, 'Submit')]
  ))

  return el
}


