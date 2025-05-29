const { Model, DataTypes } = require("sequelize");

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
        depth: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        category_id_fk: {
          type: DataTypes.INTEGER,
          allowNull: true,
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


    db.Category.hasMany(db.Category, {
      foreignKey: "category_id_fk",
      as: "SubCategories",
    });


    db.Category.belongsTo(db.Category, {
      foreignKey: "category_id_fk",
      as: "ParentCategory",
    });
}
}

module.exports = Category;
