const jwt = require("jsonwebtoken");
const { HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_BAD_REQUEST } =
  require("http2").constants;
const { celebrate, Joi } = require("celebrate");
const isUrl = require("validator/lib/isURL");
const validationUrl = (url) => {
  const validate = isUrl(url);
  if (validate) {
    return url;
  }
  throw HTTP_STATUS_BAD_REQUEST.send({
    message: `Переданы некорректные данные`,
  });
};
const validationID = (id) => {
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    return id;
  }
  throw HTTP_STATUS_BAD_REQUEST.send({
    message: `Переданы некорректные данные`,
  });
};

module.exports.validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(validationUrl),
  }),
});

module.exports.validationCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(validationID),
  }),
});

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    // throw res.status(HTTP_STATUS_UNAUTHORIZED).send({
    //   message: `Необходима авторизация`,
    // });
    return res.status(401).send({ message: "Необходима авторизация" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({
      message: `Необходима авторизация`,
    });
  }
  req.user = payload;
  next();
};
