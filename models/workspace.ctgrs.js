const { Model, DataTypes } = require("sequelize");

// 필드값: team_id, txtFilePath, project_name, members
class Workspacectgrs extends Model {
  static init(sequelize) {
    return super.init(
      {
        workspace_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,

        },
        uid: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        workspace_name: {
          type: DataTypes.STRING(120),
          allowNull: false,
        },
        workspacectgrs_name: {
          type: DataTypes.STRING(120),
          // allowNull: false,
          // unique: true
        },

        workspacesubctgrs_name: {
          type: DataTypes.STRING(120),
        },

        depth: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultvalue: 1
        },
        parent_id: {
          type: DataTypes.STRING(120),
        }

      },
      {
        sequelize,
        modelName: "Workspacectgrs",
        tableName: "workspacectgrs",
        timestamps: true,
        uniqueKeys: {
          unique_subcategory_constraint: {
            fields: ['uid', 'workspace_name', 'workspacectgrs_name']
          }
        }

      }
    );
  }
  static associate(db) {
    this.hasMany(db.Workspacectgrs, {
      as: 'subCategories',
      foreignKey: 'parent_id',
    });
    this.belongsTo(db.Workspacectgrs, {
      as: 'parentCategories',
      foreignKey: 'parent_id'
    });
    this.belongsTo(db.Workspace, {
      foreignKey: "workspace_name",
      targetKey: "workspace.name"

    })
    this.belongsTo(db.User, {
      foreignKey: "uid",
      targetKey: "uid"
    })
  }
}
module.exports = Workspacectgrs;
