const User = require("../models/user");
const {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
} = require("http2").constants;

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      } else {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) =>
      res
        .status(HTTP_STATUS_BAD_REQUEST)
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
        return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: `Некорректный id ${req.params.userId}`,
        });
      } else {
        return res
          .status(HTTP_STATUS_BAD_REQUEST)
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
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      } else {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
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
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: `Переданы некорректные данные с ошибкой ${err.name}`,
        });
      } else {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: `Произошла ошибка ${err.name}` });
      }
    });
};

// const wrapper = (req,res) => (promise.then((user) => res.send({ data: user }))
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
//           message: `Переданы некорректные данные с ошибкой ${err.name}`,
//         });
//       } else {
//         res
//           .status(HTTP_STATUS_BAD_REQUEST)
//           .send({ message: `Произошла ошибка ${err.name}` });
//       }
//     }))
// module.exports = { updateUser, updateUserAvatar };
