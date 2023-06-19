const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { HTTP_STATUS_NOT_FOUND } = require("http2").constants;
const { login, createUser } = require("./controllers/users");
// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {});

app.post("/signin", login);
app.post("/signup", createUser);
app.use("/", require("./routes/index"));

app.use((req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Неправильный путь" });
});

app.listen(3000);
