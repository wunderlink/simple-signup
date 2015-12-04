var SimpleSignup = require('..')

var ss = SimpleSignup({ server: 'http://localhost:3023' })

init()

function init () {
  var main = document.createElement('div')
  document.body.appendChild(main)
  
  document.body.appendChild(makeLink('Sign Up', '#/signup'))
  document.body.appendChild(makeLink('Log In', '#/login'))
  document.body.appendChild(makeLink('Change Password', '#/change-password-request'))
  document.body.appendChild(makeLink('Protected', '#/protected'))
  document.body.appendChild(makeLink('Log Out', '#/logout'))

  window.addEventListener('hashchange', function () { runRoutes(main) })

  runRoutes(main)
}

function runRoutes (el) {
  var appState = window.location.hash.replace('#/', '')
  el.innerHTML = ''

  if (appState === 'signup') return signupRoute(el)
  if (appState.match(/^confirm/)) return confirmRoute(el, appState)
  if (appState === 'protected') return protectedRoute(el)
  if (appState === 'login') return loginRoute(el)
  if (appState === 'logout') return logoutRoute(el)
  if (appState === 'change-password-request') return changePasswordRequestRoute(el)
  if (appState.match(/^change-password\//)) return changePasswordRoute(el, appState)

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

}

function onLogin (err, result) {
  window.location.hash = '/protected'
}

function protectedRoute (el) {
  if (ss.authToken()) {
    el.innerHTML = 'You\'re logged in'
  } else {
    el.innerHTML = 'Not logged in!'
  }
}

function loginRoute (el) {
  if (ss.authToken()) return window.location.hash = '/protected'

  var form = ss.login(onLogin)
  el.appendChild(form)

}

function logoutRoute (el) {
  ss.logout()
  el.innerHTML = 'You are logged out'
}

function changePasswordRequestRoute (el) {
  var urlTemplate = window.location.origin + '#/change-password/<%= email %>/<%= changeToken %>'
  var bodyTemplate = [
    '<h1>Welcome to Example</h1>',
    '<p>',
    '<a href="' + urlTemplate + '">Please click to change your password</a> ',
    '</p>'
  ].join('')

  var opts = {
    bodyTemplate: bodyTemplate,
    from: 'Example ChangePassword <example@signup.com>',
    subject: 'Change Your Password!'
  }

  var form = ss.changePasswordRequest(opts)
  el.appendChild(form)
}

function changePasswordRoute (el, appState) {
  var paths = appState.split('/')
  var opts = {
    email: paths[1],
    changeToken: paths[2],
    confirmDelay: 5000
  }

  var conf = ss.changePassword(opts, onLogin)
  el.appendChild(conf)
}

function makeLink (text, url) {
  var a = document.createElement('a')
  a.style.margin = '5px'
  a.innerHTML = text
  a.href = url
  return a
}
