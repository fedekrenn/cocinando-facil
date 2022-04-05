// Clase constructora que me permite crear un listado de recetas
class Recetas {
    constructor(nombre, ingredientes, tiempoDeCoccion) {
        this.nombre = nombre;
        this.ingredientes = ingredientes;
        this.tiempoDeCoccion = tiempoDeCoccion;
    }
    longitud() {                                      // Método para conocer cantidad de ingredientes
        return (this.ingredientes).length;
    }
}


// Arrays, son definidos con let y no con const ya que posteriormente se modifican(borrado para nueva carga)
let dificultadRecetas = [];
let recetasAComparar = [];
let listadoDeRecetas = [];
let nuevaReceta = {};





// Obtengo lo almacenado en localStore de haber algun dato, uso el operador avanzado lógico OR para que cree el array en caso de no haber nada
let baseDeDatos = JSON.parse(localStorage.getItem('recetas guardadas')) || [];

// Cuando se carga la página llamo a la función que trae las recetas guardadas en el Local Storage
window.onload = imprimirReceta(baseDeDatos);




// Obtener Elementos del formulario y de la tabla
let formulario = document.getElementById("formulario");
let nombreReceta = document.getElementById("nombreReceta");
let cantidadIngredientes = document.getElementById("cantidadIngredientes");
let tiempoReceta = document.getElementById("tiempoCocina");
let divContenedorTablaRecetas = document.querySelector(".creadorCantidadRecetas");


// Obtengo botones
let guardadoLocal = document.querySelector(".guardadoLocal");
let deleteButton = document.querySelector(".delete");
let compareButton = document.querySelector(".compare");
const botonSwitch = document.querySelector("#switch");


// Ejecución de funciones según clicks o cambios del usuario
cantidadIngredientes.addEventListener("change", crearInputs);
formulario.addEventListener("submit", enviarFormulario);
guardadoLocal.addEventListener("click", enviarALocal);
compareButton.addEventListener("click", comparandoRecetas);



// Modo Oscuro
botonSwitch.addEventListener("click", aplicarModoOscuro);

// Recogemos del localStorage la información sobre activación o no del modo oscuro para la carga inicial de la web
if (localStorage.getItem("dark-mode") === "true") {
    document.body.classList.toggle("dark");
    botonSwitch.classList.toggle("active");
} else {
    document.body.classList.remove("dark");
    botonSwitch.classList.remove("active");
}






//FUNCIONES

// Creamos en el HTML los input para el form que crea la receta
function crearInputs() {

    borrarInputs(); // Ejecuto antes que nada la función de borrado para que, si hay previamente ingredientes cargados, sean borrados

    for (let i = 0; i < cantidadIngredientes.value; i++) {
        divContenedorTablaRecetas.innerHTML += `<input type="text" class="areaIngrediente" placeholder="Ingrediente ${i + 1}" required>`;
    }
}


// Borramos en el HTML los inputs que previamente creamos, sirve para resetear la carga de ingredientes cuando enviamos una receta
function borrarInputs() {

    // Se crea dentro de esta función ya que en la carga inicial del documento no existe ningun input, se crea según la cantidad que indica el usuario, entonces la llamo cuando la necesito
    const borradoIngredientes = document.querySelectorAll(".areaIngrediente");
    // Con forEach remuevo cada uno de los inputs
    borradoIngredientes.forEach(element => element.remove());
}


// Función que se ejecuta al enviar el form
function enviarFormulario(e) {

    // Reseteo de evento default
    e.preventDefault();

    // Cada ingrediente está en un input individual, por lo que con este código los recojo y envío a arrayIngredientes
    let listadoIngredientes = document.querySelectorAll(".areaIngrediente");
    const arrayIngredientes = [];
    listadoIngredientes.forEach(ingrediente => arrayIngredientes.push(ingrediente.value));

    // Creo la receta
    nuevaReceta = new Recetas(nombreReceta.value, arrayIngredientes, tiempoReceta.value);

    // La envío al array "listadoDeRecetas" que luego me servirá para enviar al local y comparar
    listadoDeRecetas.push(nuevaReceta);

    // Añado la receta al DOM llamando a la función
    imprimirReceta(listadoDeRecetas);

    // Reseteo los valores, para añadir nuevas recetas
    nombreReceta.value = "";
    cantidadIngredientes.value = "";
    tiempoReceta.value = "";

    // Llamo a la función que borra los input HTML
    borrarInputs();
}


function enviarALocal() {

    // Aquí vacío el array, para evitar que si da muchas veces al boton "Guardar receta", se multipliquen valores
    listadoDeRecetas = [];

    // Obtengo los valores de las recetas que el usuario cargó.
    let nombre = document.getElementsByClassName("nombreRecetaGuardada");
    let ingredientes = document.getElementsByClassName("recetaIngredientesGuardada");
    let tiempo = document.getElementsByClassName("recetaTiemposGuardada");


    // Ciclo que pushea toda la info al array listadoDeRecetas
    for (let i = 0; i < ingredientes.length; i++) {

        // Función que obtiene los ingredientes en forma string y los lista en un array
        function convertirEnArray() {
            let obtenerIngredientes = ingredientes[i].textContent;
            let nuevoArrayIngredientes = obtenerIngredientes.split(", ");
            return nuevoArrayIngredientes;
        }

        // Tomando los elementos del html creo el listado de recetas que serán guardados en el localStorage
        listadoDeRecetas.push(new Recetas(nombre[i].textContent, convertirEnArray(), parseInt(tiempo[i].textContent)));
    }

    // Convierto en string y envio al localStorage
    let recetasJSON = JSON.stringify(listadoDeRecetas);
    localStorage.setItem("recetas guardadas", recetasJSON);

    // Copio el array original a otros 2 ya que "listadoDeRecetas" será vaciado. Estos array de copia es para posteriormente generar el calculador de dificultad.
    dificultadRecetas = [...listadoDeRecetas];
    recetasAComparar = [...listadoDeRecetas];
    listadoDeRecetas = [];

    // Ejecuto la función que crea las opciones de lista desplegable para el comparador
    generarSelectIngredientes();


    // Alerta de carga correcta
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Las recetas se cargaron correctamente!',
        showConfirmButton: false,
        timer: 1500
    })
}


/* Aplicamos cada receta a la tabla, se pasa un parámetro ya que lo reutilizo dependiendo el array, primero para
 crear las recetas que el usuario va cargando y luego para lo que está en el local storage */
function imprimirReceta(array) {

    let cuerpoTabla = document.querySelector("tbody");

    for (const i of array) {
        let tabla = document.createElement("tr");

        tabla.innerHTML = `<td class="nombreRecetaGuardada">${i.nombre}</td>
                           <td class="recetaIngredientesGuardada">${(i.ingredientes).join(", ")}</td>
                           <td class="recetaTiemposGuardada">${i.tiempoDeCoccion}</td>
                           <td><i class="fa-solid fa-trash botonBorrado"></i></td>`;

        cuerpoTabla.appendChild(tabla);

        // Evento de borrado de receta en tabla, se declara en este scoope ya que se puede ejecutar luego de crear un elemento
        tabla.querySelector(".botonBorrado").addEventListener("click", eliminarRecetaTabla);
    }


    // Función para borrar la fila (por ende el ingrediente) del producto que el usuario clickee
    function eliminarRecetaTabla(event) {
        Swal.fire({
            title: 'Está seguro de eliminar la receta?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, me arrepentí'
        }).then((result) => {

            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Receta Borrada!',
                    icon: 'success',
                    text: 'La receta ha sido borrada'
                });
                const botonApretado = event.target;
                botonApretado.closest("tr").remove();
            }
        });
        
    }

    // Reseteo el array, ya que si no cuando se da a guardar se crean muchas veces tablas con recetas repetidas
    listadoDeRecetas = [];
}

function generarSelectIngredientes() {

    // Borro lo previamente cargado para que cuando se apriete el botón no haya opciones duplicadas
    removerComparacion();

    // Obtengo del dom la etiqueta select
    const cuerpoSelect1 = document.getElementById("primerComparador");
    const cuerpoSelect2 = document.getElementById("segundoComparador");

    // Genero la etiqueta option, logrando que la lista desplegable tenga todas las recetas que se guardaron antes
    for (let i = 0; i < dificultadRecetas.length; i++) {
        cuerpoSelect1.innerHTML += `<option value="${dificultadRecetas[i].nombre}">${dificultadRecetas[i].nombre}</option>`;
        cuerpoSelect2.innerHTML += `<option value="${dificultadRecetas[i].nombre}">${dificultadRecetas[i].nombre}</option>`;
    }

    // Vacío el array para evitar duplicaciones
    dificultadRecetas = [];
}


function removerComparacion() {

    // Obtengo del dom la etiqueta select
    const cuerpoSelect1 = document.getElementById("primerComparador");
    const cuerpoSelect2 = document.getElementById("segundoComparador");

    // Borro el contenido
    cuerpoSelect1.innerHTML = "";
    cuerpoSelect2.innerHTML = "";

}

function comparandoRecetas() {

    // Obtengo del dom la etiqueta select
    const receta1 = document.getElementById("primerComparador");
    const receta2 = document.getElementById("segundoComparador");

    //Con el método .filter() traigo el objeto (receta) completo, esto me sirve para acceder al método longitud() que declaré en el constructor
    const $recetaUno = recetasAComparar.filter((val) => val.nombre == receta1.value);
    const $recetaDos = recetasAComparar.filter((val) => val.nombre == receta2.value);

    //Mensaje de error si las recetas son iguales
    function errorRecetasIguales() {
        Swal.fire({
            title: 'Error!',
            text: 'Las recetas tienen que ser diferentes para poder compararse',
            icon: 'error',
            confirmButtonText: 'Reintentar'
        })
    }

    //Notificación con el resultado de la comparación
    function resultadoComparacion(uno, dos) {
        Swal.fire({
            text: `Cocinar ${(uno.nombre).toLowerCase()} es más difícil ya que lleva ${uno.longitud()} ingredientes, en cambio ${(dos.nombre).toLowerCase()} lleva sólamente ${dos.longitud()}`,
            icon: 'success',
            confirmButtonText: 'Seguir comparando'
        })
    }

    //Función que compara la cantidad de ingredientes para determinar cuál receta es más complicada de cocinar, se usa el método .longitud() del objeto 
    function masDificilDeCocinar(primerReceta, segundaReceta) {
        primerReceta == segundaReceta ? errorRecetasIguales() : (primerReceta.longitud()) > (segundaReceta.longitud()) ? resultadoComparacion(primerReceta, segundaReceta) : resultadoComparacion(segundaReceta, primerReceta);
    }

    masDificilDeCocinar($recetaUno[0], $recetaDos[0]);
}

function aplicarModoOscuro() {

    // Seteamos clases en el html
    document.body.classList.toggle("dark");
    botonSwitch.classList.toggle("active");

    // Guardamos el modo en local storage
    document.body.classList.contains("dark") ? localStorage.setItem("dark-mode", "true") : localStorage.setItem("dark-mode", "false");

}


