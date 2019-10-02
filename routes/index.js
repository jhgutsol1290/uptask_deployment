const {Router} = require('express')
const router = Router()

//importar express validator
const { body } = require('express-validator')

//importar controlador
const proyectosController = require('../controllers/proyectosController')
const tareasController = require('../controllers/tareasController')
const usuariosController = require('../controllers/usuariosController')
const authController = require('../controllers/authController')



//ruta para home
router.get('/', 
    authController.usuarioAutenticado,
    proyectosController.proyectosHome
)

router.get('/nuevo-proyecto', 
    authController.usuarioAutenticado,
    proyectosController.formularioProyecto
)
router.post('/nuevo-proyecto',
    authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.nuevoProyecto
)

//listar proyecto
router.get('/proyectos/:url', 
    authController.usuarioAutenticado, 
    proyectosController.proyectoPorUrl
)

//actualizar proyecto
router.get('/proyecto/editar/:id', 
    authController.usuarioAutenticado, 
    proyectosController.formularioEditar
)
router.post('/nuevo-proyecto/:id', 
    authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.actualizarProyecto
)

//eliminar proyecto
router.delete('/proyecto/:url', 
    authController.usuarioAutenticado, 
    proyectosController.eliminarProyecto
)

//Tareas
router.post('/proyectos/:url', 
    authController.usuarioAutenticado, 
    tareasController.agregarTarea
)

//actualizar tareas
router.patch('/tareas/:id', 
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea
)

//eliminar tareas
router.delete('/tareas/delete/:id', 
    authController.usuarioAutenticado, 
    tareasController.eliminarTarea
)


//Crear Nueva cuenta
router.get('/crear-cuenta', usuariosController.formCrearCuenta)
router.post('/crear-cuenta', usuariosController.crearCuenta)
router.get('/confirmar/:correo', usuariosController.confirmarCuenta)

//Iniciar sesion
router.get('/iniciar-sesion', usuariosController.formIniciarSesion)
router.post('/iniciar-sesion', authController.autenticarUsuario)

//Cerrar sesión
router.get('/cerrar-sesion', authController.cerrarSesion)

//reestablecer contraeña
router.get('/reestablecer', 
    usuariosController.formRestablecerPassword
)

router.post('/reestablecer', 
    authController.enviarToken
)

router.get('/reestablecer/:token', 
    authController.validarToken
)

router.post('/reestablecer/:token',
    authController.actualizarPassword
)

module.exports = router