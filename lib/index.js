var h = require('hyperscript')
var Authentic = require('authentic-client')
var xtend = require('xtend')
var Wildemitter = require('wildemitter')

var renderBox = require('./box')

var ls = window.localStorage

var keyPrefix = 'ss_'

var SimpleSignup = module.exports = function (opts) {
  if (!(this instanceof SimpleSignup)) return new SimpleSignup(opts)
  this.auth = Authentic(xtend(opts, {
    authToken: this.get('authToken'),
    email: this.get('email')
  }))
  this.auth.on('authToken', this.set.bind(this, 'authToken'))
  this.auth.on('email', this.set.bind(this, 'email'))
  this.links = opts.links || {}
  this.styles = opts.styles
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
    title: 'Create Your Account',
    action: 'Sign Up',
    fields: fields,
    onSubmit: onSubmit,
    styles: this.styles,
    links: [
      {href: this.links.login, text: 'Log In'},
      {href: this.links.changePasswordRequest, text: 'Reset Password'}
    ]
  }

  el.appendChild(renderBox(opts))

  function onSubmit (formState) {
    auth.signup(xtend(emailOpts, formState), function (err, result) {
      el.innerHTML = ''
      if (err) {
        opts.error = err.message
        opts.state = formState

        el.appendChild(renderBox(opts))

        return
      }

      el.appendChild(renderSignupComplete())
    })
  }

  return el
}

SimpleSignup.prototype.login = function(onLogin) {
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
    title: 'Log in to Your Account',
    action: 'Log In',
    fields: fields,
    onSubmit: onSubmit,
    styles: this.styles,
    links: [
      {href: this.links.signup, text: 'Create Account'},
      {href: this.links.changePasswordRequest, text: 'Reset Password'}
    ]
  }

  el.appendChild(renderBox(opts))

  function onSubmit (formState) {
    auth.login(formState, function (err, result) {
      el.innerHTML = ''
      if (err) {
        opts.error = err.message
        opts.state = formState

        el.appendChild(renderBox(opts))

        return
      }

      onLogin(null, result)
    })
  }

  return el
}

SimpleSignup.prototype.changePasswordRequest = function(emailOpts) {
  var auth = this.auth

  var fields = [
    {
      label: 'Email',
      property: 'email'
    }
  ]

  var el = document.createElement('div')

  var opts = {
    title: 'Reset Your Password',
    action: 'Send Reset Code',
    fields: fields,
    onSubmit: onSubmit,
    styles: this.styles,
    links: [
      {href: this.links.login, text: 'Log In'},
      {href: this.links.signup, text: 'Create Account'}
    ]
  }

  el.appendChild(renderBox(opts))

  function onSubmit (formState) {
    auth.changePasswordRequest(xtend(emailOpts, formState), function (err, result) {
      el.innerHTML = ''
      if (err) {
        opts.error = err.message
        opts.state = formState

        el.appendChild(renderBox(opts))

        return
      }

      el.appendChild(renderChangePasswordComplete())
    })
  }

  return el
}


SimpleSignup.prototype.changePassword = function(changeOpts, onLogin) {
  var auth = this.auth

  var fields = [
    {
      label: 'Password',
      property: 'password',
      type: 'password'
    }
  ]

  var el = document.createElement('div')

  var opts = {
    title: 'Set Password',
    action: 'changePassword',
    fields: fields,
    onSubmit: onSubmit
  }

  el.appendChild(renderBox(opts))

  function onSubmit (formState) {
    auth.changePassword(xtend(changeOpts, formState), function (err, result) {
      el.innerHTML = ''
      if (err) {
        opts.error = err.message
        opts.state = formState

        el.appendChild(renderBox(opts))

        return
      }

      el.innerHTML = result.message

      if (!opts.confirmDelay) return onLogin(null, result)

      el.innerHTML = result.message + ' We are now logging you in...'
      setTimeout(onLogin, opts.confirmDelay, null, result)
    })
  }

  return el
}


SimpleSignup.prototype.confirm = function (opts, cb) {
  var el = document.createElement('div')
  el.innerHTML = 'loading...'

  this.auth.confirm(opts, function (err, result) {
    if (err) {
      el.innerHTML = err.message
      return cb(err)
    }

    el.innerHTML = result.message

    if (!opts.confirmDelay) return cb(null, result)

    setTimeout(cb, opts.confirmDelay, null, result)
  })

  return el
}

SimpleSignup.prototype.logout = function() {
  this.auth.logout()
}

SimpleSignup.prototype.set = function (key, val) {
  var lsKey = keyPrefix + key
  if (typeof val !== 'undefined' && val !== null) {
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

function renderChangePasswordComplete () {
  var el = h('div',
    'Check your email for a link to change your password!')
  return el
}

function renderSignupComplete () {
  var el = h('div',
    'Signup complete! Check your email for the confirmation link')
  return el
}
