const router = require('express').Router(); // импортируем роутер из express

const users = require('./users'); // импортируем роутер users.js
const cards = require('./cards'); // импортируем роутер cards.js

router.use('/users', users);
router.use('/cards', cards);

module.exports = router; // экспортировали этот роутер
