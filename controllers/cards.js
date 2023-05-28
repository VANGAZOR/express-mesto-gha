const Card = require("../models/card");

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      } else {
        return res
          .status(500)
          .send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.name}` })
    );
};

module.exports.deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "NotFound") {
        return res.status(404).send({
          message: `Карточка не найдена ${err.name}`,
        });
      } else {
        return res
          .status(500)
          .send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user_id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: `Карточка не найдена` });
      } else {
        return res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: `Переданы некорректные данные`,
        });
      } else {
        return res
          .status(500)
          .send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user_id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: `Карточка не найдена` });
      } else {
        return res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: `Переданы некорректные данные`,
        });
      }
      return res.status(500).send({ message: `Произошла ошибка ${err.name}` });
    });
};
