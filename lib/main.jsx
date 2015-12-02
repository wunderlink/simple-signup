var React = require('react')
var mui = require('material-ui')
var { Router, Route, Link, History } = require('react-router')
var {AppCanvas, AppBar, Paper, LeftNav, Menu, MenuItem} = mui

var Auth = require('./auth.js')
//var Palette = require('./palette')
var {version} = require('../package.json')

//var ThemeManager = new mui.Styles.ThemeManager()
var ThemeManager = require('material-ui/lib/styles/theme-manager')

var Main = module.exports = React.createClass({
  mixins: [History],

  getDefaultProps() {
    return {
      menuItems: [
        {route: '/', text: 'Dashboard'},
        { type: MenuItem.Types.SUBHEADER, text: 'Reports' },
        {route: '/reports', text: 'Revenue'},
        { type: MenuItem.Types.SUBHEADER, text: 'Settings' },
        {route: '/settings/access-control', text: 'Access Control'},
        {route: '/select-company', text: 'Select Company'},
        {route: '/logout', text: 'Log Out'}
      ]
    }
  },

  getInitialState() {
    return {
      authToken: Auth.getAuthToken(),
      authEmail: Auth.getAuthEmail()
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

    Auth.on('token', (token) => {
      this.setState({authToken: token})
    })

    Auth.on('email', (email) => {
      this.setState({authEmail: email})
    })

    Api.on('availableCompanies', (availableCompanies) => {
      var showSelectCompany = (availableCompanies && availableCompanies.length > 1)
      this.setState({_showSelectCompany: showSelectCompany})
    })

    Api.on('selectedCompany', (company) => {
      this.setState({selectedCompany: company})
    })

    if (Auth.loggedIn()) Api.getAvailableCompanies(function () {})

  },

  contextTypes: {
    router: React.PropTypes.func
  },

  render() {
    var appStyle = {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch'
    }

    var containerStyle = {
      display: 'flex',
      flex: 1,
      justifyContent: 'flex-start',
      flexDirection: 'row',
      alignItems: 'stretch',
      alignContent: 'stretch'
    }

    var contentStyle = {}

    var title = 'Rollout'
    if (this.state.selectedCompany) {
      title += ' - ' + this.state.selectedCompany.name
    }

    return (
      <div style={appStyle}>
        <AppBar title={title}
                iconElementLeft={<span />}
                iconElementRight={<img src='/rollmob-logo.png'
                style={{width: 195}} />} />

        <div style={{position: 'fixed', bottom: 5, right: 5, color: '#eee'}}>
          {version}
        </div>

        <div style={containerStyle}>
          { this.state.authToken ?
            <Menu
              style={{flex: '0 0 12em', order: -1, borderRight: '1px solid #eee'}}
              selectedIndex={this._getSelectedIndex()}
              onItemTap={this._onMenuItemClick}
              zDepth={0}
              menuItems={this._getMenuItems()} />
            : '' }

          <div style={{flex: 1, padding: 24}} zDepth={0}>
            {!this.state.authToken ?
              <div style={{
                background: 'url(/img/bg-city-b.jpg) #ddd no-repeat center center',
                backgroundSize: 'cover',
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1
              }}></div>
            : ''}
            {this.props.children}
          </div>
        </div>

      </div>
    )
  },

  _getMenuItems() {
    var coSelected = Api.selectedCompany()
    if (!coSelected) return [{route: '/logout', text: 'Log Out'}]

    var menuItems = []
    this.props.menuItems.forEach( (item) => {
      var isSelect = item.route === '/select-company'
      if (!isSelect) return menuItems.push(item)
      if (this.state._showSelectCompany) return menuItems.push(item)
    })

    return menuItems
  },

  _getSelectedIndex() {
    var menuItems = this.props.menuItems
    var currentItem

    for (var i = menuItems.length - 1; i >= 0; i--) {
      currentItem = menuItems[i]
      if (currentItem.route && this.history.isActive(currentItem.route)) return i
    }
  },

  _onMenuItemClick(evt, idx, item) {
    this.history.pushState(null, item.route)
  }
})
/*
*/
