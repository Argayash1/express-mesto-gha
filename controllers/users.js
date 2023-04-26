const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;

const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user'); // импортируем модель user

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

const getCurrentUserInfo = (req, res) => {
  const userId = req.user._id;

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
  const {
    name, about, avatar, email, password,
  } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
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

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // отправим токен, браузер сохранит его в куках
      res.cookie('jwt', token, {
        // token - наш JWT токен, который мы отправляем
        maxAge: 3600000,
        httpOnly: true,
      });
      // отправим токен пользователю
      res.send({ token })
        .end(); // если у ответа нет тела, можно использовать метод end
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
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
  getCurrentUserInfo,
  createUser,
  login,
  updateProfile,
  updateAvatar,
};
