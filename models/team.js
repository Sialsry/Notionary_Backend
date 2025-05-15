const { Model, DataTypes } = require("sequelize");

// 필드값: uid, team_id
class Team extends Model {
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
      },
      {
        sequelize,
        modelName: "Team",
        tableName: "team",
        timestamps: false,
      }
    );
  }
  static associate(db) {
    db.Team.belongsTo(db.User, {
      foreignKey: "uid",
      targetKey: "uid",
    });
    db.Team.belongsTo(db.TeamProject, {
      foreignKey: "project_id",
      targetKey: "project_id",
    });
  }
}

module.exports = Team;
