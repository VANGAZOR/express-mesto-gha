const Card = require("../models/card");

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}` });
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
        res.status(404).send({
          message: `Карточка не найдена ${err.name}`,
        });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};

module.exports.addLike = (req, res) => {
  console.log(req.params);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: "1" } },
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.name}` })
    );
};

module.exports.removeLike = (req, res) => {
  console.log(req.params);
  console.log(req.user);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: 1 } },
    { new: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.name}` })
    );
};
