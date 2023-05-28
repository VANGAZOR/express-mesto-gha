const cardRoutes = require("express").Router();

const {
  createCard,
  getAllCards,
  deleteCardId,
  addLike,
  removeLike,
} = require("../controllers/cards");

cardRoutes.get("/", getAllCards);
cardRoutes.post("/", createCard);
cardRoutes.delete("/:cardId", deleteCardId);
cardRoutes.put("/:cardId/likes", addLike);
cardRoutes.delete("/:cardId/likes", removeLike);

module.exports = cardRoutes;
