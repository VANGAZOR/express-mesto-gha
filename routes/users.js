// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя
const router = require("express").Router();

// const User = require("../models/user");
const {
  createUser,
  getAllUsers,
  getUserId,
  updateUser,
  updateUserAvatar,
} = require("../controllers/users");

router.post("/users", createUser);
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserId);
router.patch("/users/me", updateUser);
router.patch("/users/me/avatar", updateUserAvatar);
router.get("/test", function (req, res) {
  res.send(req.params);
});
module.exports = router;
