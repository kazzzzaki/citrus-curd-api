"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  task.init(
    {
      userid: DataTypes.INTEGER,
      task: DataTypes.STRING,
      project: DataTypes.STRING,
      priority: DataTypes.INTEGER,
      due: DataTypes.DATE,
      comment: DataTypes.STRING,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "task",
      underscored: true,
    }
  );
  return task;
};
