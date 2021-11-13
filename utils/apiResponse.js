exports.apiResponse = ({ code = 200, data = null, errorMessage = "" }) => {
  let response;
  if (code === 200) {
    response = {
      Data: data,
      Status: "SUCCESS",
    };
  } else {
    response = {
      Status: "ERROR",
      Message: errorMessage,
    };
  }

  return response;
};
