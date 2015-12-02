
var h = require('hyperscript')
var Authentic = require('authentic-client')


var SimpleSignup = module.exports = function (opts) {
  this.auth = Authentic(opts)
}


SimpleSignup.prototype.signup = function () {
  var auth = this.auth

  var fields = [
    {
      label: 'Email',
      property: 'email'
    },
    {
      label: 'Password',
      property: 'password',
      type: 'password'
    }
  ]

  var el = document.createElement('div')

  var opts = {
    action:'Signup',
    fields: fields,
    onSubmit: onSubmit
  }

  var form = renderForm(opts)
  el.appendChild(form)

  function onSubmit (formState) {
    auth.signup(formState, function (err, result) {
      el.innerHTML = ''
      if (err) {
        opts.error = err.message
        opts.state = formState
        var form = renderForm(opts)
        el.appendChild(form)
        return
      }

      el.appendChild(renderSignupComplete())
      console.log('Results', err, result)
    })
    console.log( "STATE is: ", formState )
  }

  return el
}


function renderSignupComplete () {
  var el = h('div',
    'Signup complete! Check your email for the confirmation link')
  return el
}

function renderForm (opts) {
  var formState = opts.state || {}

  var action = opts.action
  var fields = opts.fields
  var onSubmit = opts.onSubmit

  var fieldEls = fields.map( function (field) {
    return h('div',
      h('label.'+field.property,
        field.label,
        h('input.'+field.property, {
          type: field.type,
          value: formState[field.property] || '',
          onkeyup: function (evt) {
            formState[field.property] = evt.target.value
          }
        })))
  })

  var el = h.apply(null, [
    'form',
    h('h1', action)
  ].concat(
    fieldEls, [
    h('div.error', opts.error),
    h('input.signup-btn', 
      {type:'submit',
      onclick: function (evt) {
        onSubmit(formState)
        evt.preventDefault()
      }}, 'Submit')]
  ))

  return el
}
