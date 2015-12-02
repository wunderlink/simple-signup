var React = require('react')
var mui = require('material-ui')
var { Router, Route, Link, History } = require('react-router')
var {Paper, TextField, CircularProgress, FlatButton, RaisedButton} = mui

var auth = require('authentic-client')

var FormBox = require('./form-box.jsx')

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
      _isFetching: null,
      _success: null
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
    if (this.state.success) return (
      <div style={{textAlign: 'center'}}>
        <Paper zDepth={4} style={{padding: 50, width: 400, margin: '100px auto 50px'}}>
          {this.state.success}
        </Paper>
      </div>
    )

    return (
      <FormBox
        title={'Sign up for an Account'}
        actionLabel={'Sign Up'}
        fields={[
          {property: 'email', hintText: 'Your Email'},
          {property: 'password', hintText: 'Your Password', type:'password'}
        ]}
        links={[
          {label: 'Reset Password', href: '#/reset-password'},
          {label: 'Log In', href: '#/login'}
        ]}
        isBusy={this.state._isFetching}
        error={this.state.error}
        onSubmit={this._onSubmit} />
    )
  },

  _onSubmit (fields) {
    this.setState({_isFetching: true, error: null})
    auth.signUp(fields.email.toLowerCase(), fields.password, (err, data) => {
      this.setState({_isFetching: false})

      if (err) return this.setState({error: err.message})

      if (data.success) return this.setState({success: data.message})
    })
  }
})
