const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {});

app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));



app.use((req, res, next) => {
  req.user = {
    _id: "64724a9d61b726c738b1a6d4",
  };
  next();
});

app.listen(3000);
