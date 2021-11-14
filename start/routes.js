const users = require("../router/user");
const admin = require("../router/admin");
const auth = require("../router/auth");
const course = require("../router/course");

const logger = require("morgan");

const express = require("express");
// const error = require("../middleware/error");
const cors = require("cors");
const { handle404Error } = require("./errors");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());

  app.use("/api/register", users);
  app.use("/api/login", auth);
  app.use("/api/admin", admin);
  app.use("/api/courses", course);

  app.use(handle404Error);

  app.use(logger("dev"));
};
