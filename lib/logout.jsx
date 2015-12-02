var auth = require('../auth')
var React = require('react')

var { Router, Route, Link, History } = require('react-router')

var Logout = module.exports = React.createClass({
  mixins: [History],

  componentDidMount() {
    auth.logout()
    this.history.pushState(null, '/')
  },

  render() {
    return <p>You are now logged out</p>
  }
})
