var Authentic = require('authentic-client')

var auth = Authentic({
  server: 'http://localhost:1337'
})

var Wildemitter = require('wildemitter')

var ls = window.localStorage

var emailKey = 'ixAuthControllerEmail'
var tokenKey = 'ixAuthControllerToken'

var AuthController = module.exports = new Wildemitter

AuthController.setAuthController = function (email, token) {
  AuthController.setAuthControllerEmail(email)
  AuthController.setAuthControllerToken(token)
}

AuthController.getAuthControllerEmail = function () {
  return ls.getItem(emailKey)
}

AuthController.setAuthControllerEmail = function (email) {
  if (!email) {
    ls.removeItem(emailKey)
  } else {
    ls.setItem(emailKey, email)
  }

  this.emit('email', ls.getItem(emailKey))
}

AuthController.getAuthControllerToken = function () {
  return ls.getItem(tokenKey)
}

AuthController.setAuthControllerToken = function (token) {
  if (!token) {
    ls.removeItem(tokenKey)
  } else {
    ls.setItem(tokenKey, token)
  }

  this.emit('token', ls.getItem(tokenKey))
}

AuthController.loggedIn = function () {
  return !!this.getAuthControllerToken()
}

AuthController.login = function (email, password, cb) {
  var self = this
  var url = baseUrl + '/login'
  var userData = {email: email, password: password}
  auth.login(userData, function (err, body, resp) {
    if (err) return cb(err)
    if (body.error) return cb(new Error(body.error))

    self.setAuthController(email, body.data.authToken)

    cb(null, body)
  })
}

AuthController.logout = function () {
  this.setAuthControllerEmail(null)
  this.setAuthControllerToken(null)
  this.emit('logout')
}

AuthController.signUp = function (email, password, cb) {
  var url = baseUrl + '/signup'
  var userData = {email: email, password: password, origin: window.location.origin, appName: 'Rollout'}
  auth.signup(userData, function (err, body, resp) {
    if (err) return cb(err)

    if (body.error) return cb(new Error(body.error))

    cb(null, body)
  })
}

AuthController.confirm = function (email, confirmToken, cb) {
  var self = this

  var url = baseUrl + '/confirm'
  var userData = {email: email, confirmToken: confirmToken}
  auth.post(url, userData, function (err, body, resp) {
    if (err) return cb(err)

    if (body.error) return cb(new Error(body.error))

    self.setAuthController(email, body.data.authToken)

    cb(null, body)
  })
}

AuthController.requestPasswordChange = function (email, cb) {
  var url = baseUrl + '/change-password-request'
  var userData = {email: email, origin: window.location.origin, appName: 'Rollout'}
  auth.post(url, userData, function (err, body, resp) {
    if (err) return cb(err)

    if (body.error) return cb(new Error(body.error))

    cb(null, body)
  })
}

AuthController.changePassword = function (userData, cb) {
  var self = this
  var url = baseUrl + '/change-password'

  var email = userData.email

  auth.post(url, userData, function (err, body, resp) {
    if (err) return cb(err)

    if (body.error) return cb(new Error(body.error))

    self.setAuthController(email, body.data.authToken)

    cb(null, body)
  })
}


// var routes = [
//   '/auth/signup'
//   '/auth/confirm'
//   '/auth/login'
//   '/auth/change-password-request'
//   '/auth/change-password'
// ]
