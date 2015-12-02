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
  displayName: 'reset',

  mixins: [History],

  getDefaultProps() {
    return {
    }
  },

  getInitialState() {
    return {
      email: null
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
        title={'Reset Your Password'}
        actionLabel={'Send Reset Code'}
        fields={[
          {property: 'email', hintText: 'Your Email'}
        ]}
        links={[
          {label: 'Sign Up', href: '#/signup'},
          {label: 'Log In', href: '#/login'}
        ]}
        isBusy={this.state._isFetching}
        error={this.state.error}
        onSubmit={this._onSubmit} />
    )
  },

  _onSubmit (fields) {
    this.setState({_isFetching: true, error: null})
    auth.requestPasswordChange(fields.email, (err, data) => {
      this.setState({_isFetching: false})

      if (err) return this.setState({error: err.message})

      if (data.success) return this.setState({success: data.message})
    })
  }
})
