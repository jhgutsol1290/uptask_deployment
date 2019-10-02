const express = require('express')
const routes = require('./routes')
const path = require('path')
//const expressValidator = require('express-validator')
const flash = require('connect-flash')
//const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')
//importar variables.env
require('dotenv').config({path: 'variables.env'})

//helpers con algunas funciones
const helpers = require('./helpers')

//Crear conexión a DB
const db = require('./config/db')

//Importar el modelo
require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')


db.sync()
    .then(()=>console.log('Conectado al servidor'))
    .catch(e=>console.log(e))

//crear app de express
const app = express()

//Donde cargar archivos estáticos
app.use(express.static('public'))

//habilitar pug
app.set('view engine', 'pug')

//habilitar bodyParser para leer datos del formulario
app.use(express.urlencoded({extended: true}))

//agregamos express validator a toda la aplicacion
//app.use(expressValidator())

//añadir carpeta de vistas
app.set('views', path.join(__dirname, './views'))

//agregar flash messages
app.use(flash())

app.use(cookieParser())

//sessiones nos permite navegar entre distintas páginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

//colocar después de session
app.use(passport.initialize())
app.use(passport.session())

//Pasar var dump y mensajes (flash) a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump
    res.locals.mensajes = req.flash()
    res.locals.usuario = {...req.user} || null
    next()
})

app.use('/', routes)

//servidor y puerto
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.listen(port, host, () => console.log('Servidor funcionando'))
