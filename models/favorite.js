"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Course }) {
      // define association here

      //  this.belongsTo(User, { foreignKey: "userId", as: "users" });
      this.belongsToMany(Course, {
        foreignKey: "favoriteId",
        as: "courses",
        through: "Favorite_Course",
      });
    }
  }
  Favorite.init(
    {},
    {
      sequelize,

      modelName: "Favorite",
    }
  );
  return Favorite;
};
