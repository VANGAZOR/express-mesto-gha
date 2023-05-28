const userRoutes = require("express").Router();

const {
  createUser,
  getAllUsers,
  getUserId,
  updateUser,
  updateUserAvatar,
} = require("../controllers/users");

userRoutes.post("/", createUser);
userRoutes.get("/", getAllUsers);
userRoutes.get("/:userId", getUserId);
userRoutes.patch("/me", updateUser);
userRoutes.patch("/me/avatar", updateUserAvatar);

module.exports = userRoutes;
