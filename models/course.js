"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Comment, Favorite }) {
      // define association here

      this.belongsTo(User, { as: "users", foreignKey: "userId" });
      this.hasMany(Comment, { foreignKey: "courseId", as: "comments" });
      this.belongsToMany(Favorite, {
        foreignKey: "courseId",
        as: "favorites",
        through: "Favorite_Course",
      });
    }
  }
  Course.init(
    {
      Title: DataTypes.STRING,
      Description: DataTypes.STRING,
      Body: DataTypes.STRING,
      ImageUrl: DataTypes.STRING,
      VideoUrl: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "courses",
      modelName: "Course",
    }
  );
  return Course;
};
