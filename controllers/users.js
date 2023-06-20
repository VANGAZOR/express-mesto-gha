const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_CONFLICT,
} = require("http2").constants;

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => {
      res.status(HTTP_STATUS_CREATED).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(HTTP_STATUS_CONFLICT).send({
          message: `Юзер с таким email уже существует`,
        });
      }
      if (err.name === "ValidationError") {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) =>
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Произошла ошибка ${err.name}` })
    );
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: `Юзер не найден по указанному id ${req.params.userId}`,
        });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Некорректный id ${req.params.userId}`,
        });
      } else {
        return res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: `Юзер не найден`,
        });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Некорректный id`,
        });
      } else if (err.message === "NotFound") {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: `Юзер не найден`,
        });
      } else next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(next);
};
