const { Model, DataTypes } = require("sequelize");

// 필드값: id, uid, txtFilePath, project_name
class MyProject extends Model {
  static init(sequelize) {
    return super.init(
      {
        project_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        uid: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        txtFilePath: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        project_name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "MyProject",
        tableName: "myproject",
        timestamps: true,
      }
    );
  }
  static associate(db) {
    db.MyProject.belongsTo(db.User, {
      foreignKey: "uid",
      targetKey: "uid",
    });
  }
}

module.exports = MyProject;
