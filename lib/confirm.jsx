var React = require('react')
var mui = require('material-ui')
var { Router, Route, Link, History } = require('react-router')
var {Paper, TextField, CircularProgress, FlatButton, RaisedButton} = mui

var Palette = require('../palette')
var {version} = require('../../package.json')
var auth = require('../auth')

var ThemeManager = new mui.Styles.ThemeManager()

var Main = module.exports = React.createClass({
  displayName: 'confirm',

  mixins: [History],

  getDefaultProps() {
    return {
    }
  },

  getInitialState() {
    var confirmToken = this.props.params.confirmToken
    var email = this.props.params.email

    return {
      email: email,
      confirmToken: confirmToken,
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
    this._confirm()
  },

  contextTypes: {
    router: React.PropTypes.func
  },

  render() {

    return (
      <div style={{textAlign: 'center'}}>
        <Paper zDepth={4} style={{padding: 50, width: 500, margin: '100px auto 50px'}}>

          { this.state._isFetching ? <CircularProgress mode={'indeterminate'}/> : '' }

          <div style={{color: 'red'}}>{ this.state.error }</div>

        </Paper>
      </div>
    )
  },

  _confirm () {
    this.setState({_isFetching: true, error: null})
    auth.confirm(this.state.email, this.state.confirmToken, (err, data) => {
      this.setState({_isFetching: false})

      if (err) return this.setState({error: err.message})

      if (data.success) {
        this.history.pushState(null, '/')
      }

    })
  }
})

