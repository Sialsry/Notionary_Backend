const { Model, DataTypes } = require("sequelize");

// 필드값: id, uid, category_id, title, imgPaths, content, created_at, updated_at
class Post extends Model {
  static init(sequelize) {
    return super.init(
      {
        post_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        uid: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        fk_workspace_id: { 
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        workspace_pages : {
          type : DataTypes.STRING(50),
          allowNull : true,
        },
        title: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        imgPaths: {
          type: DataTypes.STRING(1000),
          allowNull: false,
        },
        videoPaths: {
          type: DataTypes.STRING(1000),
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Post",
        tableName: "post",
        timestamps: true,
      }
    );
  }
  static associate(db) {
    db.Post.belongsTo(db.User, {
      foreignKey: "uid",
      targetKey: "uid",
    });
    db.Post.belongsTo(db.Category, {
      foreignKey: "category_id",
      targetKey: "category_id",
    });
    db.Post.belongsTo(db.Workspacectgrs, { 
      foreignKey: "fk_workspace_id",
      targetKey: "fk_workspace_id",   
       onDelete: 'CASCADE',
      onUpdate : 'CASCADE'  
    });
    db.Post.hasMany(db.Comment, {
      foreignKey: "post_id",
      sourceKey: "post_id",
    });
    db.Post.hasMany(db.Heart, {
      foreignKey: "post_id",
      sourceKey: "post_id",
    });
  }
}

module.exports = Post;