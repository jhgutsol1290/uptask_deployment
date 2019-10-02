const Sequelize = require('sequelize')
const passport = require('passport')
const Usuarios = require('../models/Usuarios')
const Op = Sequelize.Op
const crypto = require('crypto')
const bcrypt = require('bcrypt-nodejs')
const enviarEmail = require('../handlers/email')


exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

//función para revisar si el usuario está logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    //si el usuario está autenticado, adelante
    if(req.isAuthenticated()) {
        return next()
    }

    //si no está autenticado, redirigir al formulario
    return res.redirect('iniciar-sesion')
}

//función oara cerrar sesión
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion') //al cerrar sesión nos lleva al login
    })
}

//genera un token si el usuario es válido
exports.enviarToken = async (req, res) => {
    //verificar que el usuario existe
    const { email } = req.body

    const usuario = await Usuarios.findOne({where: { email }})

    //Si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta')
        return res.redirect('/reestablecer')
    }

    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expiracion = Date.now() + 3600000
    
    //guardarlos en la base de datos
    await usuario.save()

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`

    //envía el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecerPassword'
    })

    //terminar proceso
    req.flash('correcto', 'Se envió correo')
    res.render('/iniciar-sesion')
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    })

    //si no encuentra usuario
    if(!usuario) {
        req.flash('error', 'No válido')
        res.redirect('/reestablecer')
    }

    //formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reset Password'
    })

}

//cambia el password por uno nuevio
exports.actualizarPassword = async (req, res) => {
    //verifica token válido y fecha de expiración
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    })

    //verificamos si el usuario existe
    if(!usuario) {
        req.flash('error', 'No válido')
        return res.redirect('/reestablecer')
    }

    // hashear el nuevo password

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    usuario.token = null
    usuario.expiracion = null
    
    //guardar el nuevo password
    await usuario.save()
    req.flash('correcto', 'Password actualizado')
    res.redirect('/iniciar-sesion')


}