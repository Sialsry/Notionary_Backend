const { Model, DataTypes } = require("sequelize");

// 필드값: id, uid, post_id, category_id, content, created_at
class Comment extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        uid: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        post_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Comment",
        tableName: "comment",
        timestamps: true,
      }
    );
  }
  static associate(db) {
    db.Comment.belongsTo(db.User, {
      foreignKey: "uid",
      targetKey: "uid",
    });
    db.Comment.belongsTo(db.Post, {
      foreignKey: "post_id",
      targetKey: "post_id",
    });
  }
}

module.exports = Comment;
