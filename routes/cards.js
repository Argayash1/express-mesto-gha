const router = require('express').Router();
const { getCards, createCard, deleteCardById } = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', createCard);

router.delete('/cards/:cardId', deleteCardById);

module.exports = router; // экспортировали роутер
