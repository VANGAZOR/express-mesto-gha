const Card = require("../models/card");
const {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_FORBIDDEN,
} = require("http2").constants;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(HTTP_STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      } else {
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Произошла ошибка ${err.name}` })
    );
};

module.exports.deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error("Карточка не найдена"))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return res
          .status(HTTP_STATUS_FORBIDDEN)
          .send({ message: `Вы не можете удалить чужую карточку` });
      }
      if (!card) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: "Карточка не существует" });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      }
      if (err.message === "NotFound") {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: "Карточка не существует" });
        return;
      } else {
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
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
        return res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: `Карточка не найдена` });
      } else {
        return res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные`,
        });
      } else {
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
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
        return res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: `Карточка не найдена` });
      } else {
        return res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные`,
        });
      }
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Произошла ошибка ${err.name}` });
    });
};
