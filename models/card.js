const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    // у карточки есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждой карточки, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: {
    // у карточки есть ссылка на картинку — опишем требования к ссылке на картинку в схеме:
    type: String, // ссылка на картинку — это строка
    required: true, // оно должно быть у каждого пользователя, так что ссылка — обязательное поле
  },
  owner: {
    // у карточки есть ссылка на модель автора карточки — опишем требования к ссылке в схеме:
    type: mongoose.Schema.Types.ObjectId, // информация о себе — это строка
    ref: 'user',
    required: true,
  },
  likes: {
    // у карточки есть ссылка на модель автора карточки — опишем требования к ссылке в схеме:
    type: [mongoose.Schema.Types.ObjectId], // информация о себе — это строка
    ref: 'user',
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
