const { Model, DataTypes } = require("sequelize");

// 필드값: team_id, txtFilePath, project_name, members
class Page extends Model {
  static init(sequelize) {
    return super.init(
      {
        workspace_id : {
            type : DataTypes.INTEGER,
        },
        Page_name: {
          type: DataTypes.STRING(120),
          primaryKey: true,
          allowNull: false,
        },
        page_content: {
          type : DataTypes.TEXT,
          
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
      foreignKey: "workspace_id",
      targetKey: "project_name",
    });
    // db.Page.hasMany(db.Pages, {
    //   foreignKey: "project_id",
    //   sourceKey: "project_id",
    // });
  }
}
module.exports = Page;
