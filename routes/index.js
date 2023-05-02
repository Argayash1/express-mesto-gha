const router = require('express').Router(); // импортируем роутер из express
const auth = require('../middlewares/auth');

const { NOT_FOUND_404 } = require('../utils/constants');

const users = require('./users'); // импортируем роутер users.js
const cards = require('./cards'); // импортируем роутер cards.js
const { createUser, login } = require('../controllers/users');
const { createUserValidator, loginValidator } = require('../middlewares/validators/userValidator');

// роуты, не требующие авторизации - регистрация и логин
router.post('/signup', createUserValidator, createUser); // добавили роутер для регистрации

router.post('/signin', login); // добавили роутеры для авторизации

// роуты, которым авторизация нужна - users и cards
router.use('/users', auth, users); // добавили роутеры для пользователей
router.use('/cards', auth, cards); // добавили роутеры для карточек

router.use('*', (req, res) => {
  res.status(NOT_FOUND_404).send({ message: 'Запрашиваемый URL не существует' });
});

module.exports = router; // экспортировали этот роутер
