var React = require('react')
var mui = require('material-ui')

var {Paper, TextField, Progress, FlatButton, RaisedButton, CircularProgress} = mui

var FormBox = module.exports = React.createClass({
    displayName: 'FormBox',

    getInitialState() {
      var fields = {}
      this.props.fields.forEach(function (field) {
        fields[field.property] = field.value
      })

      return {
        fields: fields
      }
    },

    getDefaultProps() {
      return {
        title: '',
        fields: [],
        links: [],
        isBusy: false,
        error: null,
        onSubmit: function () {}
      }
    },

    render() {
      return (
        <div style={{textAlign: 'center'}}>
          <Paper zDepth={4} style={{padding: 50, width: 400, margin: '100px auto 50px'}}>

            {this.renderForm()}

          </Paper>

        </div>
      )
    },

    renderForm() {

      if (this.props.isBusy) return <CircularProgress mode={'indeterminate'}/>

      return (
        <div>
          <h4>{this.props.title}</h4>

          { this.props.fields.map((field) => {
              return (
                <div>
                  <TextField
                    value={this.state.fields[field.property]}
                    style={{width: 250}}
                    hintText={field.hintText}
                    type={field.type}
                    onChange={this._changeField.bind(this, field.property)}
                    onKeyDown={this._onKeyDown} />
                </div>
              )
          }) }

          {this.props.error ?
            <div style={{color: 'red', marginTop: 10}}>
              {this.props.error}
            </div>
          : ''}

          <div style={{margin: 20}}>
            <RaisedButton
              style={{width: '100%'}}
              label={this.props.actionLabel}
              primary={true}
              onClick={this._submit} />
          </div>

            {this.props.links.length < 2 ? '' :
              <div style={{paddingTop: 10, paddingBottom: 20}}>
                <FlatButton
                  label={this.props.links[0].label}
                  href={this.props.links[0].href}
                  linkButton={true}
                  style={{float: 'left'}} />

                <FlatButton
                  label={this.props.links[1].label}
                  href={this.props.links[1].href}
                  linkButton={true}
                  style={{float: 'right'}} />
              </div>
            }

        </div>
      )
    },

    _changeField (field, evt) {
      var value = evt.target.value
      var state = this.state
      state.fields[field] = value
      this.setState(state)
    },

    _submit () {
      this.props.onSubmit(this.state.fields)
    },

    _onKeyDown(evt) {
      if (evt.keyCode === 13) {
        evt.preventDefault()
        this._submit()
      }
    }
})
