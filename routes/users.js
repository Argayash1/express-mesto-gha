const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regEx } = require('../utils/constants');

const {
  getUsers,
  getUserById,
  getCurrentUserInfo,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUserInfo);

router.get('/:userId', celebrate({
  // валидируем параметры, hex - шестнадцатеричная строка
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24)
      .required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(regEx),
  }),
}), updateAvatar);

module.exports = router; // экспортировали этот роутер
