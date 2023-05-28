const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { HTTP_STATUS_NOT_FOUND } = require("http2").constants;

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {});

app.use((req, res, next) => {
  req.user = {
    _id: "64724a9d61b726c738b1a6d4",
  };
  next();
});

app.use("/", require("./routes/index"));

app.use((req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Неправильный путь" });
});

app.listen(3000);
