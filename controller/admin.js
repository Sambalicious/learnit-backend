const Joi = require("joi");
const { asyncMiddleware } = require("../middleware/AsyncMiddleware");
const { User, Role } = require("../models");
const { apiResponse } = require("../utils/apiResponse");

const validateRole = (body) => {
  const schema = Joi.object({
    Email: Joi.string().email().required(),
    UserRole: Joi.string().required(),
  });

  return schema.validate(body);
};

exports.editRole = asyncMiddleware(async (req, res) => {
  let { Email, UserRole } = req.body;

  let { error } = validateRole(req.body);

  if (error) {
    return res
      .status(400)
      .json(apiResponse({ code: 400, errorMessage: error.details[0].message }));
  }

  let user = await User.findOne({ where: { Email } });

  if (!user) {
    return res
      .status(404)
      .json(apiResponse({ code: 404, errorMessage: "User not found" }));
  }

  let role = await Role.findOne({ where: { UserRole } });

  if (!role) {
    return res
      .status(404)
      .json(
        apiResponse({ code: 404, errorMessage: "This role does not exist." })
      );
  }

  await user.addRoles(role);

  console.log("count roles", await user.countRoles());

  return res
    .status(200)
    .json(
      apiResponse({ code: 200, data: { user, Role: await user.getRoles() } })
    );
});

exports.createRole = asyncMiddleware(async (req, res) => {
  let { UserRole, Email } = req.body;

  let { error } = validateRole(req.body);

  if (error) {
    return res
      .status(400)
      .json(apiResponse({ code: 400, errorMessage: error.details[0].message }));
  }

  let role = await Role.findOne({ where: { UserRole } });

  if (role) {
    return res
      .status(400)
      .json(
        apiResponse({ code: 400, errorMessage: "This role already exist" })
      );
  }

  let adminId = await User.findOne({ where: { Email } });
  role = await Role.create({ UserRole, adminId });

  return res.status(200).json(apiResponse({ code: 200, data: { role } }));
});

exports.getUsers = asyncMiddleware(async (req, res) => {
  let users = await User.findAll({ include: "roles" });

  return res.status(200).json(apiResponse({ code: 200, data: { users } }));
});
