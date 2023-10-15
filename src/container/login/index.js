import {
    Form,
    REG_EXP_EMAIL,
    REG_EXP_PASSWORD,
  } from '../../script/form'
  
  import { saveSession } from '../../script/session'
  
  class SignupForm extends Form {
    FIELD_NAME = {
      EMAIL: 'email',
      PASSWORD: 'пароль',
    }
    FIELD_ERROR = {
      IS_EMPTY: 'Це поле не можна залишати порожнім',
      IS_BIG: 'Надто довго',
      EMAIL: 'Будь ласка, введіть дійсну адресу електронної пошти',
      PASSWORD:
        'Ваш пароль має містити принаймні 8 символів, включаючи принаймні 1 цифру, 1 малу літеру та 1 велику літеру',
    }
  
    validate = (name, value) => {
      if (String(value).length < 1) {
        return this.FIELD_ERROR.IS_EMPTY
      }
  
      if (String(value).length > 30) {
        return this.FIELD_ERROR.IS_BIG
      }
  
      if (name === this.FIELD_NAME.EMAIL) {
        if (!REG_EXP_EMAIL.test(String(value))) {
          return this.FIELD_ERROR.EMAIL
        }
      }
    }
  
    submit = async () => {
      if (this.disabled) {
        this.validateAll()
      } else {
        console.log(this.value)
  
        this.setAlert('прогрес', 'Виконується завантаження...')
  
        try {
          const res = await fetch('/login', {
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
        [this.FIELD_NAME.EMAIL]:
          this.value[this.FIELD_NAME.EMAIL],
        [this.FIELD_NAME.PASSWORD]:
          this.value[this.FIELD_NAME.PASSWORD],
      })
    }
  }
  
  window.signupForm = new SignupForm()
  
  document.addEventListener('DOMContentLoaded', () => {
    if (window.session) {
      location.assign('/')
    }
  })
