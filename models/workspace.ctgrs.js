const { Model, DataTypes } = require("sequelize");

// 필드값: team_id, txtFilePath, project_name, members
class Workspacectgrs extends Model {
  static init(sequelize) {
    return super.init(
      {
        workspace_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey : true,
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
          unique_subcategory: {
            fields: ['uid', 'workspace_name', 'workspacectgrs_name']
          },
          unique_subcategory_constraint: {
            fields: ['uid', 'workspace_name', 'parent_id', 'workspacesubctgrs_name']
          }
        }
      }
    );
  }
  static associate(db) {
    this.hasOne(db.Workspacectgrs, {
      as: 'subCategories',
      foreignKey: 'fk_workspace_id',
      sourceKey: 'workspace_id',
      onDelete: 'CASCADE',
      onUpdate : 'CASCADE'
    });
    // this.hasMany(db.Workspacectgrs, {
    //   as: 'subCategories',
    //   foreignKey: 'workspace_id',
    // });
    // this.belongsTo(db.Workspacectgrs, {
    //   as: 'parentCategories',
    //   foreignKey: 'workspace_id'
    // });
    this.hasMany(db.Page,{
      foreignKey: 'fk_workspace_id',
      targetKey: 'workspace_id',
      
    })
    this.hasMany(db.Post,{
      foreignKey: 'fk_workspace_id',
      targetKey: 'workspace_id',
       onDelete: 'CASCADE',
      onUpdate : 'CASCADE'
      
    })
    this.belongsTo(db.Workspace, {
      foreignKey: "fk_workspace_name",
      targetKey: "workspace_name"

    })
    this.belongsTo(db.User, {
      foreignKey: "uid",
      targetKey: "uid"
    })
  }
}
module.exports = Workspacectgrs;
