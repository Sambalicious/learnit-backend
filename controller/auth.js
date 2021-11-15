const Joi = require("joi");
const { asyncMiddleware } = require("../middleware/AsyncMiddleware");
const { User } = require("../models");
const { apiResponse } = require("../utils/apiResponse");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const validateLogin = (body) => {
  const schema = Joi.object({
    Email: Joi.string().email().required(),
    Password: Joi.string().min(6).required().max(255),
  });

  return schema.validate(body);
};

async function decryptPassword(requestBodyPassword, storedPassword) {
  try {
    return await bcrypt.compare(requestBodyPassword, storedPassword);
  } catch (error) {
    console.log(error.message);
  }
}

exports.login = asyncMiddleware(async (req, res) => {
  let { Email, Password } = req.body;

  let { error } = validateLogin(req.body);

  if (error) {
    return res
      .status(400)
      .json(apiResponse({ code: 400, errorMessage: error.details[0].message }));
  }

  let user = await User.findOne({
    where: { Email },
    include: ["roles", "favorites"],
  });

  if (!user) {
    return res
      .status(400)
      .json(apiResponse({ code: 400, errorMessage: "Invalid credentials" }));
  }

  let validatedPassword = await decryptPassword(Password, user.Password);

  if (!validatedPassword) {
    return res
      .status(400)
      .json(apiResponse({ code: 400, errorMessage: "Invalid credentials" }));
  }

  const token = jwt.sign({ user }, process.env.SECRET_TOKEN);

  return res.status(200).json(
    apiResponse({
      code: 200,
      data: { User: user, AccessToken: token },
    })
  );
});
