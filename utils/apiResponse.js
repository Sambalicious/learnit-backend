exports.apiResponse = ({ code = 200, data = null, errorMessage = "" }) => {
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