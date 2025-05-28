// const { Model, DataTypes } = require("sequelize");

// // 필드값: team_id, txtFilePath, project_name, members
// class Workspacectgrs extends Model {
//   static init(sequelize) {
//     return super.init(
//       {
//         uid: {
//           type: DataTypes.STRING(20),
//           allowNull: false,
//         },
//         workspace_name: {
//           type: DataTypes.STRING(120),
//           allowNull: false,
//         },
//         workspacectgrs_name: {
//           type: DataTypes.STRING(120),
//           primaryKey: true,
//           allowNull: false,
//         },
     

//       },
//       {
//         sequelize,
//         modelName: "Workspacectgrs",
//         tableName: "workspacectgrs",
//         timestamps: true,
//       }
//     );
//   }