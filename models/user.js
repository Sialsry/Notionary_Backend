const { Model, DataTypes } = require("sequelize");

// 필드값: uid, upw, nick, gender, phone, dob, addr, profImg
class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        uid: {
          type: DataTypes.STRING(20),
          primaryKey: true,
          allowNull: false,
        },
        upw: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        nick: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        gender: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        phone: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        dob: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        addr: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        profImg: {
          type: DataTypes.STRING(500),
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "user",
        timestamps: true,
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Post, {
      foreignKey: "uid",
      sourceKey: "uid",
    });
    db.User.hasMany(db.Comment, {
      foreignKey: "uid",
      sourceKey: "uid",
    });
    db.User.hasMany(db.Heart, {
      foreignKey: "uid",
      sourceKey: "uid",
    });
    db.User.hasMany(db.MyProject, {
      foreignKey: "uid",
      sourceKey: "uid",
    });
    db.User.hasMany(db.TeamProject, {
      foreignKey: "uid",
      sourceKey: "uid",
    });
    db.User.hasMany(db.Team, {
      foreignKey: "uid",
      sourceKey: "uid",
    });
  }
}

module.exports = User;
