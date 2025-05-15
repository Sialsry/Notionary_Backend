const { Model, DataTypes } = require("sequelize");

// 필드값 : category_id, category_name
class Category extends Model {
  static init(sequelize) {
    return super.init(
      {
        category_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        category_name: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Category",
        tableName: "category",
        timestamps: false,
      }
    );
  }
  static associate(db) {
    db.Category.hasMany(db.Post, {
      foreignKey: "category_id",
      sourceKey: "category_id",
    });
  }
}

module.exports = Category;

//
