var h = require('hyperscript')
var defaultStyles = require('./styles')

module.exports = function renderForm (opts) {
  var styles = opts.styles === false ? {} : defaultStyles

  var formState = opts.state || {}

  var action = opts.action
  var fields = opts.fields
  var onSubmit = opts.onSubmit

  var fieldEls = fields.map(function (field) {
    return h('.ss',
      h('input.ss-input.' + field.property, {
        style: styles.input,
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
        h('.ss-error', {style: styles.error}, opts.error),
        h('button.ss-submit', {style: styles.submit},
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

