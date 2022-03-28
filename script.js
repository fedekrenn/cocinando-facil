//Clase constructora que me permite crear un listado de recetas
class Recetas {
    constructor(nombre, ingredientes, tiempoDeCoccion) {
        this.nombre = nombre;
        this.ingredientes = ingredientes;
        this.tiempoDeCoccion = tiempoDeCoccion;
    }
}


//Arrays, son definidos con let y no con const ya que posteriormente se modifican(borrado para nueva carga)
let listadoDeRecetas = [];
let nuevaReceta = {};


//Obtengo lo almacenado en localStore de haber algun dato, uso el operador avanzado lógico OR para que cree el array en caso de no haber nada
let baseDeDatos = JSON.parse(localStorage.getItem('recetas guardadas')) || [];


//Obtener Elementos del formulario y de la tabla
let formulario = document.getElementById("formulario");
let nombreReceta = document.getElementById("nombreReceta");
let cantidadIngredientes = document.getElementById("cantidadIngredientes");
let tiempoReceta = document.getElementById("tiempoCocina");
let divContenedorTablaRecetas = document.querySelector(".creadorCantidadRecetas");
let guardadoLocal = document.querySelector(".guardadoLocal");


//Obtenemos la cantidad de ingredientes que quiere el usuario y ejecutamos la función
cantidadIngredientes.addEventListener("change", crearInputs);
formulario.addEventListener("submit", enviarFormulario);
guardadoLocal.addEventListener("click", enviarALocal);


//Cuando se carga la página llamo a la función que trae las recetas guardadas en el Local Storage
window.onload = imprimirReceta(baseDeDatos);





//FUNCIONES

// Creamos en el HTML los input para el form que crea la receta
function crearInputs() {

    borrarInputs(); // Ejecuto antes que nada la función de borrado para que, si hay previamente ingredientes cargados, sean borrados

    for (let i = 0; i < cantidadIngredientes.value; i++) {
        let tabla = document.createElement("div");
        tabla.innerHTML = `<input type="text" class="areaIngrediente" placeholder="Ingrediente ${i + 1}" required>`;
        divContenedorTablaRecetas.appendChild(tabla);
    }
}


//Borramos en el HTML los inputs que previamente creamos, sirve para resetear la carga de ingredientes cuando enviamos una receta
function borrarInputs() {

    // Se crea dentro de esta función ya que en la carga inicial del documento no existe el div, se crea según la cantidad que indica el usuario, entonces la llamo cuando la necesito
    const borradoIngredientes = document.querySelectorAll(".areaIngrediente");
    //Con forEach remuevo cada uno de los inputs
    borradoIngredientes.forEach(element => element.remove())
}


//Función que se ejecuta al enviar el form
function enviarFormulario(e) {

    //Reseteo de evento default
    e.preventDefault();

    // Creo un array con los ingredientes que recojo de los input
    const arrayIngredientes = [];
    let listadoIngredientes = document.querySelectorAll(".areaIngrediente");


    listadoIngredientes.forEach(ingrediente => arrayIngredientes.push(ingrediente.value));

    //Creo la receta
    nuevaReceta = new Recetas(nombreReceta.value, arrayIngredientes, tiempoReceta.value);
    listadoDeRecetas.push(nuevaReceta);

    //Añado la receta al DOM llamando a la función
    imprimirReceta(listadoDeRecetas);

    //Reseteo los valores, para añadir nuevas recetas
    nombreReceta.value = "";
    cantidadIngredientes.value = "";
    tiempoReceta.value = "";

    //Llamo a la función que borra los input HTML
    borrarInputs();
}


// Se borra la fila (por ende el ingrediente) del producto que el usuario clickee
function removerRecetaDeTabla(event) {

    const botonApretado = event.target;
    botonApretado.closest("tr").remove();
}


function enviarALocal() {

    //Aquí vacío el array, para evitar que si da muchas veces al boton "Guardar receta", se multipliquen valores
    listadoDeRecetas = [];

    //Obtengo los valores de las recetas que el usuario cargó.
    let nombre = document.getElementsByClassName("nombreRecetaGuardada");
    let ingredientes = document.getElementsByClassName("recetaIngredientesGuardada");
    let tiempo = document.getElementsByClassName("recetaTiemposGuardada");


    //Ciclo que pushea toda la info al array listadoDeRecetas
    for (let i = 0; i < ingredientes.length; i++) {

        //Función que obtiene los ingredientes en forma string y los lista en un array
        function convertirEnArray() {
            let obtenerIngredientes = ingredientes[i].outerText;
            let nuevoArrayIngredientes = obtenerIngredientes.split(", ");
            return nuevoArrayIngredientes;
        }

        //Tomando los elementos del html creo el listado de recetas que serán guardados en el localStorage
        listadoDeRecetas.push(new Recetas(nombre[i].outerText, convertirEnArray(), parseInt(tiempo[i].outerText)));
    }

    //Convierto en string y envio al localStorage
    let recetasJSON = JSON.stringify(listadoDeRecetas);
    localStorage.setItem("recetas guardadas", recetasJSON);
    listadoDeRecetas = [];
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

        //Evento de borrado de receta en tabla, se declara en este scoope ya que se puede ejecutar luego de crear un elemento
        tabla.querySelector(".botonBorrado").addEventListener("click", removerRecetaDeTabla);
    }

    //Reseteo el array, ya que si no cuando se da a guardar se crean muchas veces tablas con recetas repetidas
    listadoDeRecetas = [];
}
