"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Course }) {
      // define association here
      this.belongsTo(Course, { foreignKey: "courseId", as: "courses" });
    }
  }
  Comment.init(
    {
      Body: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
