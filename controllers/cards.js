const Card = require("../models/card");

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.name}` })
    );
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.name}` })
    );
};

module.exports.deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.name}` })
    );
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.name}` })
    );
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.name}` })
    );
};
