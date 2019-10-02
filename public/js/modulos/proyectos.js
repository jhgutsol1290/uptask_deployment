import Swal from 'sweetalert2'
import axios from 'axios'

const btnEliminar = document.querySelector('#eliminar-proyecto')

if(btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl

        Swal.fire({
            title: 'Deseas eliminar este proyecto?',
            text: "Un proyecto eliminado no se puede recuperar",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.value) {
            //enviar peticion a AXIOS
            const url = `${location.origin}/proyecto/${urlProyecto}`

            axios.delete(url, { params: { urlProyecto } })
                .then((res) => {
                    console.log(res)
                    Swal.fire(
                        'Proyecto Eliminado!',
                        res.data,
                        'success'
                    )
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 3000)
                })
                .catch(() => {
                    Swal.fire({
                        type: 'error',
                        title: 'Hubo un error',
                        text: 'No se pudo eliminar el proyecto'
                    })
                })
            }
        })
    })
}

export default btnEliminar