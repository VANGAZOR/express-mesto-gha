const router = require("express").Router();

const {
  createCard,
  getAllCards,
  deleteCardId,
  addLike,
  removeLike,
} = require("../controllers/users");

router.get("/cards", getAllCards);
router.post("/cards", createCard);
router.get("/cards/:cardId", deleteCardId);
router.put("/cards/:cardId/likes", addLike);
router.delete("/cards/:cardId/likes", removeLike);

module.exports = router;