const Card = require('../models/card');

// Функция, которая возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

// Функция, которая создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => card.populate('owner'))
    // вернём записанные в базу данные
    .then((card) => res.status(200).send(card))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

// Функция, которая удаляет карточку по идентификатору
module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => card.populate('likes'))
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};
