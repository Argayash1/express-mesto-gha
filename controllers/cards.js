const Card = require('../models/card');

// Функция, которая возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

// Функция, которая создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id; // _id станет доступен

  Card.create({ name, link, owner: ownerId })
    // вернём записанные в базу данные
    .then((card) => res.status(200).send({ data: card }))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

// Функция, которая удаляет карточку по идентификатору
module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};
