"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here

      this.belongsToMany(User, { foreignKey: "userId", through: "User_Role" });
    }

    toJSON() {
      return { ...this.get(), id: undefined, User_Role: undefined };
    }
  }

  Role.init(
    {
      UserRole: {
        type: DataTypes.ENUM("admin", "student", "superAdmin", "teacher"),
        defaultValue: "student",
      },
    },
    // {
    //   defaultScope: {
    //     attributes: { exclude: [] },
    //   },
    // },
    {
      sequelize,
      tableName: "roles",
      modelName: "Role",
    }
  );
  return Role;
};
