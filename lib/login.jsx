var React = require('react')
var mui = require('material-ui')
var { Router, Route, Link, History } = require('react-router')
var {Paper, TextField, Progress, FlatButton, RaisedButton, CircularProgress} = mui

var FormBox = require('./form-box.jsx')

var auth = require('../auth')
var Palette = require('../palette')
var {version} = require('../../package.json')

var ThemeManager = new mui.Styles.ThemeManager()

var Main = module.exports = React.createClass({
  displayName: 'login',

  mixins: [History],

  getDefaultProps() {
    return {
    }
  },

  getInitialState() {
    return {
      email: null,
      password: null,
      _isFetching: null
    }
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  componentWillMount() {
    ThemeManager.setPalette(Palette)
  },

  contextTypes: {
    router: React.PropTypes.func
  },

  render() {

    return (
      <FormBox
        title={'Log in to Your Account'}
        actionLabel={'Log In'}
        fields={[
          {property: 'email', hintText: 'Your Email'},
          {property: 'password', hintText: 'Your Password', type:'password'}
        ]}
        links={[
          {label: 'Reset Password', href: '#/reset-password'},
          {label: 'Sign Up', href: '#/signup'}
        ]}
        isBusy={this.state._isFetching}
        error={this.state.error}
        onSubmit={this._onSubmit} />
    )
  },

  _onSubmit (fields) {
    this.setState({_isFetching: true, error: null})
    auth.login(fields.email.toLowerCase(), fields.password, (err, data) => {
      this.setState({_isFetching: false})

      if (err) return this.setState({error: err.message})

      if (data.success) {
        this.setState({success: data.message})
        this.history.pushState(null, '/')
      }
    })
  }
})
