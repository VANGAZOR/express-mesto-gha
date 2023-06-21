const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const regexUrl =
  /^(http[s]:\/\/)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+(\.[a-zA-Z]{2,}([a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=])*)/;
const { celebrate, Joi } = require("celebrate");
const { HTTP_STATUS_NOT_FOUND } = require("http2").constants;
const { login, createUser } = require("./controllers/users");
// const { validationLogin, validationCreateUser } = require("./middlewares/auth");
const auth = require("./middlewares/auth");

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {});
app.use(auth);
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(regexUrl),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.use("/", require("./routes/index"));

app.use((req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Неправильный путь" });
});

app.listen(3000);
