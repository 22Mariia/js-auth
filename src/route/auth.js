// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

User.create({
  email: 'test@gmail.com',
  password: '123',
  role: 1,
})

User.create({
  email: 'admin@gmail.com',
  password: '123',
  role: 2,
})

User.create({
  email: 'developer@gmail.com',
  password: '123',
  role: 3,
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signup', {
    // вказуємо назву контейнера
    name: 'signup',
    // вказуємо назву компонентів
    component: [
      'back-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],

    // вказуємо назву сторінки
    title: 'Signup Page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {
      role: [
        { value: User.USER_ROLE.USER, text: 'User' },
        {
          value: User.USER_ROLE.ADMIN,
          text: 'Administrator',
        },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Developer',
        },
      ],
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/signup', function (req, res) {
  const { email, password, role } = req.body

  console.log(req.body)

  if (!email || !password || !role) {
    return res.status(400).json({
      message: 'Помилка! Обов"язкові поля відсутні',
    })
  }

  try {
    const user = User.getByEmail(email)
    if (user) {
      return res.status(400).json({
        message:
          'User with this email address already exists',
      })
    }
    const newUser = User.create({ email, password, role })
    const session = Session.create(newUser)
    Confirm.create(newUser.email)

    return res.status(200).json({
      message:
        'Новий користувач успішно зареєстрований',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Помилка в процесі реєстрації',
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/recovery', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('recovery', {
    // вказуємо назву контейнера
    name: 'recovery',
    // вказуємо назву компонентів
    component: ['back-button', 'field'],

    // вказуємо назву сторінки
    title: 'Recovery Page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/recovery', function (req, res) {
  const { email } = req.body

  console.log(email)

  if (!email) {
    return res.status(400).json({
      message: 'Помилка! Обов"язкові поля відсутні',
    })
  }

  try {
    const user = User.getByEmail(email)
    if (!user) {
      return res.status(400).json({
        message:
          'Адреса електронної пошти, яку ви ввели, не належить жодному користувачу',
      })
    }

    Confirm.create(email)
    return res.status(200).json({
      message:
        'Код для відновлення пароля надіслано на вашу електронну пошту',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/recovery-confirm', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('recovery-confirm', {
    // вказуємо назву контейнера
    name: 'recovery-confirm',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password'],

    // вказуємо назву сторінки
    title: 'Recovery Confirm Page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  console.log(password, code)

  if (!code || !password) {
    return res.status(400).json({
      message: 'Помилка! Обов"язкові поля відсутні',
    })
  }

  try {
    const email = Confirm.getData(Number(code))
    if (!email) {
      return res.status(400).json({
        message: 'Будь ласка, введіть дійсний код',
      })
    }

    const user = User.getByEmail(email)
    if (!user) {
      return res.status(400).json({
        message:
          'Адреса електронної пошти, яку ви ввели, не належить жодному користувачу',
      })
    }

    user.password = password
    console.log(user)

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Ваш пароль був змінений',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup-confirm', function (req, res) {
  // res.render генерує нам HTML сторінку

  const { renew, email } = req.query

  if (renew) {
    Confirm.create(email)
  }

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signup-confirm', {
    // вказуємо назву контейнера
    name: 'signup-confirm',
    // вказуємо назву компонентів
    component: ['back-button', 'field'],

    // вказуємо назву сторінки
    title: 'Signup Confirm Page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  console.log(code, token)

  if (!code || !token) {
    return res.status(400).json({
      message: 'Помилка! Обов"язкові поля відсутні',
    })
  }

  try {
    const session = Session.get(token)
    if (!session) {
      return res.status(400).json({
        message: 'Будь ласка, увійдіть у свій обліковий запис',
      })
    }

    const email = Confirm.getData(code)
    if (!email) {
      return res.status(400).json({
        message: 'Будь ласка, введіть дійсний код',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Будь ласка, введіть дійсний код',
      })
    }

    const user = User.getByEmail(session.user.email)
    user.isConfirm = true

    session.user.isConfirm = true

    return res.status(200).json({
      message: 'Вашу електронну адресу підтверджено',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/login', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('login', {
    // вказуємо назву контейнера
    name: 'login',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password'],

    // вказуємо назву сторінки
    title: 'Login Page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/login', function (req, res) {
  const { email, password } = req.body

  console.log(email, password)

  if (!email || !password) {
    return res.status(400).json({
      message: 'Помилка! Обов"язкові поля відсутні',
    })
  }

  try {
    const user = User.getByEmail(email)
    if (!user) {
      return res.status(400).json({
        message:
          'Помилка! Користувача з цією електронною адресою не існує',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Помилка! Неправильний пароль',
      })
    }

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Ви увійшли до свого облікового запису',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// Підключаємо роутер до бек-енду
module.exports = router
