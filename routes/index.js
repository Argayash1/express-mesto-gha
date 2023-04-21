const router = require('express').Router(); // импортируем роутер из express
const { NOT_FOUND_ERROR_CODE } = require('../utils/constants');

const users = require('./users'); // импортируем роутер users.js
const cards = require('./cards'); // импортируем роутер cards.js

router.use('/users', users); // добавили роутеры для пользователей
router.use('/cards', cards); // добавили роутеры для карточек

router.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый URL не существует' });
});

module.exports = router; // экспортировали этот роутер
