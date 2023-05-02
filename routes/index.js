// Импорт роутеров
const router = require('express').Router(); // импортируем роутер из express
const users = require('./users'); // импортируем роутер users.js
const cards = require('./cards'); // импортируем роутер cards.js

// Импорт миддлвэра для авторизации
const auth = require('../middlewares/auth');

// Импорт кастомного класса ошибок NotFoundError
const NotFoundError = require('../errors/NotFoundError');

// Импорт контроллеров и валидаторов
const { createUser, login } = require('../controllers/users');
const { createUserValidator, loginValidator } = require('../middlewares/validators/userValidator');

// роуты, не требующие авторизации - регистрация и логин
router.post('/signup', createUserValidator, createUser); // добавили роутер для регистрации
router.post('/signin', loginValidator, login); // добавили роутеры для авторизации

// роуты, которым авторизация нужна - users и cards
router.use('/users', auth, users); // добавили роутеры для пользователей
router.use('/cards', auth, cards); // добавили роутеры для карточек

// роут для запросов по несуществующим URL
router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый URL не существует'));
});

module.exports = router; // экспортировали этот роутер
