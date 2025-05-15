const { Model, DataTypes } = require("sequelize");

// 필드값: team_id, txtFilePath, project_name, members
class TeamProject extends Model {
  static init(sequelize) {
    return super.init(
      {
        uid: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        project_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
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
        modelName: "TeamProject",
        tableName: "teamproject",
        timestamps: true,
      }
    );
  }
  static associate(db) {
    db.TeamProject.belongsTo(db.User, {
      foreignKey: "uid",
      targetKey: "uid",
    });
    db.TeamProject.hasMany(db.Team, {
      foreignKey: "project_id",
      sourceKey: "project_id",
    });
  }
}
module.exports = TeamProject;
