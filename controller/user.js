const Joi = require("joi");
const bcrypt = require("bcryptjs");
const { asyncMiddleware } = require("../middleware/AsyncMiddleware");
const { User } = require("../models");

const validateUser = (body) => {
  const schema = Joi.object({
    name: Joi.string().required().max(255),
    password: Joi.string().required().min(6).max(50),
    email: Joi.string().required().max(255),
    avatar: Joi.string().optional(),
  });

  return schema.validate(body);
};
async function encryptPassword(password) {
  try {
    let SALT = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, SALT);
  } catch (error) {
    console.log(error.message);
  }
}

const apiResponse = ({ code = 200, data = null, errorMessage = "" }) => {
  let response;
  if (code === 200) {
    response = {
      Data: data,
      Status: "SUCCESS",
      Message: errorMessage,
    };
  } else {
    response = {
      Data: null,
      Status: "ERROR",
      Message: errorMessage,
    };
  }

  return response;
};

exports.createUser = asyncMiddleware(async (req, res) => {
  let { name, password, email, avatar } = req.body;
  let { error } = validateUser(req.body);

  if (error) {
    return res
      .status(400)
      .json(apiResponse({ code: 400, error: error.details[0].message }));
  }

  let user = await User.findOne({ where: { email } });

  if (user) {
    return res.status(400).json(
      apiResponse({
        code: 400,
        errorMessage: "This user is already registered",
      })
    );
  }

  password = await encryptPassword(password);

  user = await User.create({
    name,
    email,
    password,
    avatar,
  });
  return res.status(200).json(apiResponse({ code: 200, data: { user } }));
});
