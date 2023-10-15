import { Form } from '../../script/form'

import {
  saveSession,
  getTokenSession,
  getSession,
} from '../../script/session'

class SignupConfirmForm extends Form {
  FIELD_NAME = {
    CODE: 'code',
  }
  FIELD_ERROR = {
    IS_EMPTY: 'TЦе поле не можна залишати порожнім',
    IS_BIG: 'Надто довго',
  }

  validate = (name, value) => {
    if (String(value).length < 1) {
      return this.FIELD_ERROR.IS_EMPTY
    }

    if (String(value).length > 30) {
      return this.FIELD_ERROR.IS_BIG
    }
  }

  submit = async () => {
    if (this.disabled) {
      this.validateAll()
    } else {
      console.log(this.value)

      this.setAlert('прогрес', 'Виконується завантаження...')

      try {
        const res = await fetch('/signup-confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: this.convertData(),
        })
        const data = await res.json()
        if (res.ok) {
          this.setAlert('успіх', data.message)
          saveSession(data.session)
          location.assign('/')
        } else {
          this.setAlert('помилка', data.message)
        }
      } catch (error) {
        this.setAlert('помилка', error.message)
      }
    }
  }

  convertData = () => {
    return JSON.stringify({
      [this.FIELD_NAME.CODE]: Number(
        this.value[this.FIELD_NAME.CODE],
      ),
      token: getTokenSession(),
    })
  }
}

window.signupConfirmForm = new SignupConfirmForm()

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (window.session) {
      if (window.session.user.isConfirm) {
        location.assign('/')
      }
    } else {
      location.assign('/')
    }
  } catch (e) {}

  document
    .querySelector('#renew')
    .addEventListener('click', (e) => {
      e.preventDefault()
      const session = getSession()
      location.assign(
        `/signup-confirm?renew=true&email=${session.user.email}`,
      )
    })
})
