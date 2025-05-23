const {Model, DataTypes} = require("sequelize")


class Workspace extends Model {
    static init(sequelize) {
        return super.init(
            {
                category_name : {
                    type: DataTypes.STRING(50),
                    primaryKey: true
                }
            }
        )
    }
    static associate(db) {
        db.Workspace.hasMany()
    }
}