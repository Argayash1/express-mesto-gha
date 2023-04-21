const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;

const User = require('../models/user');

const {
  CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../utils/constants');

// Функция, которая возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};

// Функция, которая возвращает пользователя по _id
const getUserById = (req, res) => {
  console.log(req.params);
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь по указанному _id не найден',
        });
        return;
      }
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: 'Передан некорректный ID пользователя' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

// Функция, которая создаёт пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then((user) => res.status(CREATED_CODE).send(user))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(' ');
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `Переданы некорректные данные при создании пользователя: ${errorMessage}`,
        });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

// Функция-декоратор, которая обновляет данные пользователя
const updateUserData = (req, res, updateOptions) => {
  const { _id: userId } = req.user;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    userId,
    updateOptions, // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь по указанному _id не найден',
        });
        return;
      }
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(', ');
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: `Переданы некорректные данные при обновлении профиля: ${errorMessage}`,
        });
        return;
      }
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: 'Передан некорректный ID пользователя' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

// Функция-декоратор, которая обновляет профиль пользователя
const updateProfile = (req, res) => {
  const updateOptions = req.body;
  updateUserData(req, res, updateOptions);
};

// Функция-декоратор, которая обновляет аватар пользователя
const updateAvatar = (req, res) => {
  const updateOptions = req.body;
  updateUserData(req, res, updateOptions);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
