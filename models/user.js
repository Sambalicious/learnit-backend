"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Course, Role }) {
      // define association here
      this.hasMany(Course, { foreignKey: "userId", as: "courses" });

      this.belongsToMany(Role, {
        foreignKey: "userId",
        through: "User_Role",
        as: "roles",
      });
    }

    toJSON() {
      return { ...this.get(), Password: undefined, id: undefined };
    }
  }
  User.init(
    {
      UserId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      Name: { type: DataTypes.STRING, allowNull: false },
      Password: { type: DataTypes.STRING, allowNull: false },
      Avatar: { type: DataTypes.STRING, allowNull: true },
      Email: {
        type: DataTypes.STRING,
        unique: true,
        set: function (val) {
          this.setDataValue("Email", val.toLowerCase());
        },
        isEmail: true,
        notEmpty: true,
        notNull: true,
      },
    },

    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );
  return User;
};
