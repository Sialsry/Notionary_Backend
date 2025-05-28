const { Model, DataTypes } = require("sequelize");

// 필드값: team_id, txtFilePath, project_name, members
class Workspace extends Model {
  static init(sequelize) {
    return super.init(
      {

        workspace_name: {
          type: DataTypes.STRING(120),
          primaryKey: true,
          allowNull: false,
        }

      },
      {
        sequelize,
        modelName: "Workspace",
        tableName: "workspace",
        timestamps: true,
      }
    );
  }
  static associate(db) {
    db.Workspace.hasMany(db.Workspacectgrs, {
      foreignKey: "fk_workspace_name",
      sourceKey : "workspace_name",
    });
  
  }
}
module.exports = Workspace;
