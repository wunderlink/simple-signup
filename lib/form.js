var h = require('hyperscript')

module.exports = function renderForm (opts) {
  var formState = opts.state || {}

  var action = opts.action
  var fields = opts.fields
  var onSubmit = opts.onSubmit

  var fieldEls = fields.map(function (field) {
    return h('.ss',
      h('input.ss-input.' + field.property, {
        style: inputStyle,
        type: field.type,
        value: formState[field.property] || '',
        placeholder: field.label,
        onkeyup: function (evt) {
          formState[field.property] = evt.target.value
        }
      })
    )
  })

  var el = h.apply(null,
    [ 'form.ss-form' ].concat(
      fieldEls,
      [
        h('.ss-error', {style: errorStyle}, opts.error),
        h('button.ss-submit', {style: submitStyle},
          { type: 'submit',
            onclick: function (evt) {
              onSubmit(formState)
              evt.preventDefault()
            }
          },
          action || 'Submit'
        )
      ]
    )
  )

  return el
}

var inputStyle = {
  'width': '100%',
  'height': '36px',
  'outline': 'none',
  'font-size': '16px',
  'font-weight': '100',
  'line-height': '24px',
  'border-width': '0px 0px 1px',
  'border-bottom-style': 'solid',
  'border-bottom-color': '#EEE',
  'margin-bottom': '16px',
  '-webkit-tap-highlight-color': 'rgba(0,0,0,0)'
}

var submitStyle = {
  'color': '#FFF',
  'background-color': '#a551e1',
  'width': '100%',
  'height': '100%',
  'padding': '0px 16px',
  'font-size': '14px',
  'font-weight': '500',
  'line-height': '36px',
  'letter-spacing': '0',
  'text-transform': 'uppercase',
  'text-decoration': 'none',
  'cursor': 'pointer',
  'outline': 'none',
  'overflow': 'hidden',
  'border': 0,
  'border-radius': '2px',
  'box-shadow': '0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)',
  '-webkit-user-select': 'none',
  '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
  '-webkit-appearance': 'button'
}

var errorStyle = {
  'margin': '20px',
  'color': 'red'
}
