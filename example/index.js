//require('../public/style.css')


var SimpleSignup = require('..')

var ss = new SimpleSignup({server:'http://localhost:3023'})

init()

function init () {
  var main = document.createElement('div')
  document.body.appendChild(main)

  window.addEventListener('hashchange', function () { runRoutes(main) })

  runRoutes(main)
}

function runRoutes (el) {
  var appState = location.hash.replace('#/', '')
  el.innerHTML = ''

  if (appState === 'signup') return signupRoute(el)
  //if (appState === 'confirm') return confirmRoute(el)
  //if (appState === 'login') return loginRoute(el)
  //if (appState === 'logout') return logoutRoute(el)

}

function signupRoute (el) {
  var form = ss.signup()
  el.appendChild(form)
}

