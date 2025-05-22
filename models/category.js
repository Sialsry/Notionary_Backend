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
        depth : {
          type : DataTypes.INTEGER,
          allowNull : false,
          defaultValue : 1
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
    db.Category.hasOne(db.Category, {
      foreignKey : "category_id_fk",
      as : "SubCategory",
      sourceKey : "category_id"
    });
  }
}

module.exports = Category;

//
