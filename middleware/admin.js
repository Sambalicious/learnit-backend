const { apiResponse } = require("../utils/apiResponse");

module.exports = function (req, res, next) {
  req.user.roles.forEach((role) => {
    if (!["admin", "superAdmin"].includes(role.UserRole)) {
      return res.status(403).json(
        apiResponse({
          code: 403,
          errorMessage:
            "You dont have enough permission to carry out this operation.",
        })
      );
    }
  });

  return next();
};
