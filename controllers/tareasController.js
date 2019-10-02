const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')


exports.agregarTarea = async (req, res, next) => {
    //Obtenemos proyecto actual
    const proyecto = await Proyectos.findOne({where: { url: req.params.url }})
    
    //leer el input
    const { tarea } = req.body

    //estado incompleto y ID del proyecto
    const estado = 0
    const proyectoId = proyecto.id

    //Insertar en la base de datos
    const resultado = await Tareas.create({
        tarea,
        estado,
        proyectoId
    })

    if(!resultado) {
        return next()
    }

    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`)
}

exports.cambiarEstadoTarea = async (req, res, next) => {
    const { id } = req.params
    const tarea = await Tareas.findOne({where: {id}})
    
    //cambiar estado
    let estado = 0
    if(tarea.estado === estado) {
        tarea.estado = 1
    } else {
        tarea.estado = estado
    }

    const resultado = await tarea.save()

    if(!resultado) {
        return next()
    }

    res.status(200).send('todo bien')
}

exports.eliminarTarea = async (req, res, next) => {
    const { id } = req.params

    //Eliminar la tarea
    const tarea = await Tareas.destroy({where: {id}})

    if(!tarea) {
        return next()
    } 

    res.status(200).send('Tarea eliminada correctamente')

}