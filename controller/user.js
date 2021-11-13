const Joi = require("joi");
const bcrypt = require("bcryptjs");
const { asyncMiddleware } = require("../middleware/AsyncMiddleware");
const { User, Role } = require("../models");
const { apiResponse } = require("../utils/apiResponse");

const validateUser = (body) => {
  const schema = Joi.object({
    Name: Joi.string().required().max(255),
    Password: Joi.string().required().min(6).max(50),
    Email: Joi.string().required().max(255).email(),
    Avatar: Joi.string().optional(),
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

exports.createUser = asyncMiddleware(async (req, res) => {
  let { Name, Password, Email, Avatar } = req.body;
  let { error } = validateUser(req.body);

  if (error) {
    return res
      .status(400)
      .json(apiResponse({ code: 400, errorMessage: error.details[0].message }));
  }

  let user = await User.findOne({ where: { Email }, include: ["roles"] });

  if (user) {
    return res.status(400).json(
      apiResponse({
        code: 400,
        errorMessage: "This user is already registered",
      })
    );
  }

  Password = await encryptPassword(Password);

  user = await User.create({
    Name,
    Email,
    Password,
    Avatar,
  });

  let role = await Role.findOne({ where: { RoleName: "student" } });

  if (!role) {
    role = await Role.create({ RoleName: "student", userId: user });
  }

  await user.addRoles(role);

  return res.status(200).json(apiResponse({ code: 200, data: { User: user } }));
});

exports.editUser = asyncMiddleware(async (req, res) => {
  let { Name, Email, Password, Avatar } = req.body;

  let { error } = validateUser(req.body);

  if (error) {
    return res
      .status(400)
      .json(apiResponse({ code: 400, errorMessage: error.details[0].message }));
  }

  let user = await User.findOne({ where: { Email } });

  if (!user) {
    return res
      .status(404)
      .json(apiResponse({ code: 404, errorMessage: "Unregistered user." }));
  }
  Password = await encryptPassword(Password);

  (user.Email = Email), (user.Password = Password);
  user.Name = Name;
  user.Avatar = Avatar;

  await user.save();

  return res.status(200).json(apiResponse({ code: 200, data: { user } }));
});
