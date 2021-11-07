"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here

      this.belongsTo(User, { as: "courses", foreignKey: "userId" });
    }
  }
  Course.init(
    {
      Title: DataTypes.STRING,
      Description: DataTypes.STRING,
      ImageUrl: DataTypes.STRING,
      VideoUrl: DataTypes.STRING,
      UserId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};