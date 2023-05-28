const User = require("../models/user");

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.name}` })
    );
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error("NotValidId"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === ("CastError" || "ValidationError")) {
        return res.status(400).send({
          message: `Некорректный id ${req.params.userId}`,
        });
      }
      if (err.name === "NotValidId") {
        return res.status(400).send({
          message: `Некорректныйй id ${req.params.userId}`,
        });
      }
      if (err.name === "NotFound") {
        return res.status(404).send({
          message: `Юзер не найден по указанному id ${req.params.userId}`,
        });
      } else {
        return res
          .status(500)
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
    .then((user) => res.send({ data: user, test: console.log(user) }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      }
      if (err.name === "CastError") {
        res.status(404).send({
          message: `Юзер не найден по указанному id ${req.params.userId}`,
        });
      } else {
        res.status(500).send({ message: `Произошла ошибка ${err.name}` });
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
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка ${err.name}` })
    );
};
