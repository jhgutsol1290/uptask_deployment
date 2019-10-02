const Usuarios = require('../models/Usuarios')
const enviarEmail = require('../handlers/email')

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta'
    })
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión',
        error
    })
}

exports.crearCuenta = async (req, res) => {
    //leer los datos
    const { email, password } = req.body

    try {
        //crear el usuario
        await Usuarios.create({
            email,
            password
        })

        //crear URL de confirmación
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`
        console.log(confirmarUrl);
        

        //crear objeto de usuario
        const usuario = {
            email
        }

        //enviar email
        /* await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        }) */

        //redireccionar al usuario
        req.flash('correcto', 'Verifica tu cuenta')
        return res.redirect('/iniciar-sesion')
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en Uptask',
            email,
            password
        })
    }
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Restablecer'
    })
}

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    })

    //SI no existe usuario
    if(!usuario) {
        req.flash('error', 'No válido')
        return res.redirect('/crear-cuenta')
    }

    usuario.activo = 1
    await usuario.save()

    req.flash('correcto', 'Cuenta activada')
    res.redirect('/iniciar-sesion')

}