const router = require('express').Router(); // импортируем роутер из express
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const { NOT_FOUND_ERROR_CODE } = require('../utils/constants');

const users = require('./users'); // импортируем роутер users.js
const cards = require('./cards'); // импортируем роутер cards.js
const { createUser, login } = require('../controllers/users');

// роуты, не требующие авторизации - регистрация и логин
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser); // добавили роутер для регистрации

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(2),
  }),
}), login); // добавили роутеры для авторизации

// роуты, которым авторизация нужна - users и cards
router.use('/users', auth, users); // добавили роутеры для пользователей
router.use('/cards', auth, cards); // добавили роутеры для карточек

router.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый URL не существует' });
});

module.exports = router; // экспортировали этот роутер
