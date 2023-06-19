const userRoutes = require("express").Router();
const {
  validationUpdateAvatar,
  validationUpdateUser,
  validationUserId,
} = require("../middlewares/auth");

const {
  getAllUsers,
  getUserId,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require("../controllers/users");

userRoutes.get("/", getAllUsers);
userRoutes.get("/me", getCurrentUser);
userRoutes.get("/:userId", getUserId);
userRoutes.patch("/me", updateUser);
userRoutes.patch("/me/avatar", updateUserAvatar);

module.exports = userRoutes;
