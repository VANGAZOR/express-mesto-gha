const userRoutes = require("express").Router();
const { celebrate, Joi } = require("celebrate");
// const {
//   validationUpdateAvatar,
//   validationUpdateUser,
//   validationUserId,
// } = require("../middlewares/auth");

const regexUrl =
  /^(http[s]:\/\/)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+(\.[a-zA-Z]{2,}([a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=])*)/;

const {
  getAllUsers,
  getUserId,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require("../controllers/users");

userRoutes.get("/", getAllUsers);
userRoutes.get("/me", getCurrentUser);
userRoutes.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserId
);
userRoutes.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);

userRoutes.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(regexUrl),
    }),
  }),
  updateUserAvatar
);

module.exports = userRoutes;
