const { Model, DataTypes } = require("sequelize");

// 좋아요 테이블
// 필드값: post_id, uid
class Heart extends Model {
  static init(sequelize) {
    return super.init(
      {
        post_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        uid: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Heart",
        tableName: "heart",
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ["post_id", "uid"],
          },
        ],
      }
    );
  }
  static associate(db) {
    db.Heart.belongsTo(db.User, {
      foreignKey: "uid",
      targetKey: "uid",
    });
    db.Heart.belongsTo(db.Post, {
      foreignKey: "post_id",
      targetKey: "post_id",
    });
  }
}

module.exports = Heart;
