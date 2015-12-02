var React = require('react')
var mui = require('material-ui')
var { Router, Route, Link, History } = require('react-router')
var {Paper, TextField, CircularProgress, FlatButton, RaisedButton} = mui

var FormBox = require('./form-box.jsx')

var Palette = require('../palette')
var {version} = require('../../package.json')
var auth = require('../auth')

var ThemeManager = new mui.Styles.ThemeManager()

var ResetPassword = module.exports = React.createClass({
  displayName: 'reset',

  mixins: [History],

  getDefaultProps() {
    return {
    }
  },

  getInitialState() {
    var changeToken = this.props.params.changeToken
    var email = this.props.params.email

    return {
      email: email,
      changeToken: changeToken,
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
        title={'Choose a New Password'}
        actionLabel={'Set Password'}
        fields={[
          {property: 'password', hintText: 'New Password', type: 'password'}
        ]}
        isBusy={this.state._isFetching}
        error={this.state.error}
        onSubmit={this._onSubmit} />
    )
  },

  _onSubmit (fields) {
    var opts = {
      email: this.state.email,
      changeToken: this.state.changeToken,
      password: fields.password
    }

    this.setState({_isFetching: true, error: null})
    auth.changePassword(opts, (err, data) => {
      this.setState({_isFetching: false})

      if (err) return this.setState({error: err.message})

      if (data.success) {
        this.history.pushState(null, '/')
        return this.setState({success: data.message})
      }
    })
  }
})
