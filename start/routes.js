const users = require("../router/user");
// const getUrl = require("../routes/getUrl");

const express = require("express");
// const error = require("../middleware/error");
const cors = require("cors");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  //   app.use("/api/shorten", shortUrl);
  app.use("/api/register", users);

  //app.use(error);
};
