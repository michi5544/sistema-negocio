// CRUD USUARIOS
const {DataTypes} = require('sequelize');
const sequelize = require('../config/db.js')

const User = sequelize.define('users', {
      id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
    name: {type: DataTypes.STRING, allowNull: false},
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,  //permite que no se repita el correo
    validate: { isEmail: true } //  validación extra
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
    role: { type: DataTypes.STRING
      ,allowNull: false
      //,defaultValue: 'Customer' 
    }

},
{
    tableName: 'users',
    timestamps: false
});

module.exports = User;
