const Sequelize = require('sequelize')
const db = require('../config/db')
const Proyectos = require('./Proyectos')
const bcrypt = require('bcrypt-nodejs')

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un correo válido'
            },
            notEmpty: {
                msg: 'Email no puede estar vacío'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Password no puede estar vacío'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token:  Sequelize.STRING,
    expiracion: Sequelize.DATE
},{
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
        }
    }
})

//métodos personalizados
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

Usuarios.hasMany(Proyectos)

module.exports = Usuarios
