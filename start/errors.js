const { apiResponse } = require("../utils/apiResponse");

exports.handle404Error = function (req, res, next) {
  res.status(404).json(
    apiResponse({
      code: 404,
      errorMessage: "This API endpoint does not exist",
    })
  );
};
