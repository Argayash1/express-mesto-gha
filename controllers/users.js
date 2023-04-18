const User = require('../models/user');

// Функция, которая возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

// Функция, которая возвращает пользователя по _id
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

// Функция, которая создаёт пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then((user) => res.status(200).send(user))
    // данные не записались, вернём ошибку
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

// Функция, которая обновляет профиль пользователя
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id: userId } = req.user;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    userId,
    { name, about }, // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

// Функция, которая обновляет аватар из профиля пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id: userId } = req.user;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    userId,
    { avatar }, // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

// res.status(200).send(user))
