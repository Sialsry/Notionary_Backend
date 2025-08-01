const { Model, DataTypes } = require("sequelize");

// 필드값: team_id, txtFilePath, project_name, members
class Page extends Model {
  static init(sequelize) {
    return super.init(
      {
        workspace_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        Page_name: {
          primaryKey: true,
          type: DataTypes.STRING(120),
          allowNull: false,
        },
        page_content: {
          type: DataTypes.TEXT,

        }
      },
      {
        sequelize,
        modelName: "Page",
        tableName: "page",
        timestamps: true,
      }
    );
  }
  static associate(db) {
    this.belongsTo(db.Workspacectgrs, {
      foreignKey: "fk_workspace_id",
      targetKey: "fk_workspace_id",
       onDelete: 'CASCADE',
      onUpdate : 'CASCADE'
    });
    // db.Page.hasMany(db.Pages, {
    //   foreignKey: "project_id",
    //   sourceKey: "project_id",
    // });
  }
}
module.exports = Page;
