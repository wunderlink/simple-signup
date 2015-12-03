var SimpleSignup = require('..')

var ss = SimpleSignup({ server: 'http://localhost:3023' })

init()

function init () {
  var main = document.createElement('div')
  document.body.appendChild(main)

  window.addEventListener('hashchange', function () { runRoutes(main) })

  runRoutes(main)
}

function runRoutes (el) {
  var appState = window.location.hash.replace('#/', '')
  el.innerHTML = ''

  if (appState === 'signup') return signupRoute(el)
  if (appState.match(/^confirm/)) return confirmRoute(el, appState)
  if (appState === 'protected') return protectedRoute(el)

  return signupRoute(el)
}

function signupRoute (el) {
  var urlTemplate = window.location.origin + '#/confirm/<%= email %>/<%= confirmToken %>'
  var bodyTemplate = [
    '<h1>Welcome to Example</h1>',
    '<p>Thanks for signing up! Please ',
    '<a href="' + urlTemplate + '">confirm your account</a> ',
    'to continue.',
    '</p>'
  ].join('')

  var opts = {
    bodyTemplate: bodyTemplate,
    from: 'Example Signup <example@signup.com>',
    subject: 'Welcome!'
  }

  var form = ss.signup(opts)
  el.appendChild(form)
}

function confirmRoute (el, appState) {
  var paths = appState.split('/')
  var opts = {
    email: paths[1],
    confirmToken: paths[2],
    confirmDelay: 5000
  }

  var conf = ss.confirm(opts, onLogin)
  el.appendChild(conf)

  function onLogin (err, result) {
    window.location.hash = '/protected'
  }
}


function protectedRoute (el) {
  if (ss.authToken) {
    el.innerHTML = 'You\'re logged in'
  } else {
    el.innerHTML = 'Not logged in!'
  }
}
