const { sequelize } = require("../models");

module.exports = async function () {
  try {
    await sequelize.authenticate(); // .sync({force: true}) drop database if it already exist / create new
    console.log("database connected");
  } catch (error) {
    console.log(error.message);
  }
};
