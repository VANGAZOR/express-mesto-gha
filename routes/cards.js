const cardRoutes = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  createCard,
  getAllCards,
  deleteCardId,
  addLike,
  removeLike,
} = require("../controllers/cards");

const regexUrl =
  /^(http[s]:\/\/)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+(\.[a-zA-Z]{2,}([a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=])*)/;

cardRoutes.get("/", getAllCards);
cardRoutes.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().required().pattern(regexUrl),
    }),
  }),
  createCard
);
cardRoutes.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCardId
);
cardRoutes.put(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  addLike
);
cardRoutes.delete(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  removeLike
);

module.exports = cardRoutes;
