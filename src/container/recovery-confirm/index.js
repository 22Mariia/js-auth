import {
    Form,
    REG_EXP_EMAIL,
    REG_EXP_PASSWORD,
  } from '../../script/form'
  
  import { saveSession } from '../../script/session'
  
  class RecoveryConfirmForm extends Form {
    FIELD_NAME = {
      CODE: 'Code',
      PASSWORD: 'password',
      PASSWORD_AGAIN: 'passwordAgain',
    }
    FIELD_ERROR = {
      IS_EMPTY: 'Це поле не можна залишати порожнім',
      IS_BIG: 'Надто довго',
      PASSWORD:
        'Ваш пароль має містити принаймні 8 символів, включаючи принаймні 1 цифру, 1 малу літеру та 1 велику літеру',
      PASSWORD_AGAIN: 'Паролі мають збігатися',
    }
  
    validate = (name, value) => {
      if (String(value).length < 1) {
        return this.FIELD_ERROR.IS_EMPTY
      }
  
      if (String(value).length > 30) {
        return this.FIELD_ERROR.IS_BIG
      }
  
      if (name === this.FIELD_NAME.PASSWORD) {
        if (!REG_EXP_PASSWORD.test(String(value))) {
          return this.FIELD_ERROR.PASSWORD
        }
      }
  
      if (name === this.FIELD_NAME.PASSWORD_AGAIN) {
        if (
          String(value) !==
          this.value[this.FIELD_NAME.PASSWORD]
        ) {
          return this.FIELD_ERROR.PASSWORD_AGAIN
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
          const res = await fetch('/recovery-confirm', {
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
        [this.FIELD_NAME.PASSWORD]:
          this.value[this.FIELD_NAME.PASSWORD],
      })
    }
  }
  
  window.recoveryConfirmForm = new RecoveryConfirmForm()
