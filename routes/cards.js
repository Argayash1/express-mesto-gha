const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regEx } = require('../utils/constants');

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regEx),
  }),
}), createCard);

router.delete(
  '/:cardId',
  // celebrate({
  // // валидируем параметры
  //   params: Joi.object().keys({
  //     cardId: Joi.string().hex().length(24).required(),
  //   }),
  // }),
  deleteCardById,
);

router.put('/:cardId/likes', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), dislikeCard);

module.exports = router; // экспортировали этот роутер
