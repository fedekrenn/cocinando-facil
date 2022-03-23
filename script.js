//Clase constructora que me permite crear un listado de recetas
class Recetas {
    constructor(nombre, ingredientes, tiempoDeCoccion) {
        this.nombre = nombre;
        this.ingredientes = ingredientes;
        this.tiempoDeCoccion = tiempoDeCoccion;
    }
    longitud() {                                      //Método para conocer cantidad de ingredientes
        return (this.ingredientes).length;
    }
    recetaConCarne() {                                 //Método para saber si la receta tiene carne
        return (this.ingredientes).some((val) => val == "carne" || val == "Carne");
    }
}


//Arrays
const listadoRecetas = [];
let nuevaReceta = {};

//Obtener Elementos del formulario y de la tabla
let formulario = document.getElementById("formulario");
let nombreReceta = document.getElementById("nombreReceta");
let cantidadIngredientes = document.getElementById("cantidadIngredientes");
let tiempoReceta = document.getElementById("tiempoCocina");
let divForm = document.querySelector(".creadorCantidadRecetas");



//Obtenemos la cantidad de ingredientes que quiere el usuario y ejecutamos la función
cantidadIngredientes.addEventListener("change", crearInputs);
formulario.addEventListener("submit", enviarFormulario);





//FUNCIONES

// Creamos en el HTML los input para la receta
function crearInputs() {

    borrarInputs(); // Ejecuto antes que nada la función de borrado para que, si hay previamente ing cargados, sean borrados

    for (let i = 0; i < cantidadIngredientes.value; i++) {
        let tabla = document.createElement("div")
        tabla.innerHTML = `<input type="text" class="areaIngrediente" placeholder="Ingrediente ${i + 1}" required>`;
        divForm.appendChild(tabla);
    }
}


//Borramos en el HTML los inputs que previamente creamos, sirve para resetear la carga de ingredientes
function borrarInputs() {
    
    // Se crea dentro de esta función ya que en la carga inicial del documento no existe el div, se crea según la cantidad que indica el usuario, entonces la llamo cuando la necesito
    const borradoIngredientes = document.querySelectorAll(".areaIngrediente"); 

    //Ciclo para borrar según la cantidad de inputs creados
    for (const inputIngrediente of borradoIngredientes) {
        inputIngrediente.remove();
    }
}

// Se borra la fila (por ende el ingrediente) del producto que el usuario clickee
function removerReceta(event){

    const botonApretado = event.target;
    botonApretado.closest("tr").remove();
}




//Función que se ejecuta al enviar el form
function enviarFormulario(e) {

    //Reseteo de evento default
    e.preventDefault();

    const arrayIngredientes = [];

    // Creo un array con los ingredientes que recojo de los input
    let listadoIngredientes = document.querySelectorAll(".areaIngrediente");
    for (const ingrediente of listadoIngredientes) {
        arrayIngredientes.push(ingrediente.value);
    }

    //Creo la receta
    nuevaReceta = new Recetas(nombreReceta.value, arrayIngredientes, tiempoReceta.value);
    listadoRecetas.push(nuevaReceta);

    //Añado la receta a la tabla llamando a la función
    imprimirReceta();

    //Reseteo los valores, para añadir nuevas recetas
    nombreReceta.value = "";
    cantidadIngredientes.value = "";
    tiempoReceta.value = "";

    //Llamo a la función que borra los input HTML
    borrarInputs();
}


// Aplicamos cada receta a la tabla
function imprimirReceta() {

    let cuerpoTabla = document.querySelector("tbody");
    let tabla = document.createElement("tr");

    for (let i = 0; i < listadoRecetas.length; i++) {
        tabla.innerHTML = `<td>${listadoRecetas[i].nombre}</td>
                           <td>${(listadoRecetas[i].ingredientes).join(", ")}</td>
                           <td>${listadoRecetas[i].tiempoDeCoccion} minutos</td>
                           <td><i class="fa-solid fa-trash botonBorrado"></i></td>`;

        cuerpoTabla.appendChild(tabla);
    };

    //Evento de borrado de receta en tabla, se declara en este scoope ya que se puede ejecutar luego de crear un elemento
    tabla.querySelector(".botonBorrado").addEventListener("click", removerReceta);
}




// NUEVOOOOOO

/*

//Función que compara la cantidad de ingredientes para determinar cuál receta es más complicada de cocinar, se usa el método .longitud() del objeto 
function masDificilDeCocinar(primerReceta, segundaReceta) {
    if ((primerReceta.longitud()) > (segundaReceta.longitud())) {
        alert(`Cocinar ${primerReceta.nombre} es más difícil ya que lleva ${primerReceta.longitud()} ingredientes, en cambio ${segundaReceta.nombre} lleva sólamente ${segundaReceta.longitud()}`);
    } else if ((primerReceta.longitud()) == (segundaReceta.longitud())){
        alert(`Ambas recetas tienen la misma dificultad ya que tienen la misma cantidad de ingredientes (${primerReceta.longitud()})`);
    } else {
        alert(`Cocinar ${segundaReceta.nombre} es más difícil ya que lleva ${segundaReceta.longitud()} ingredientes, en cambio ${primerReceta.nombre} lleva sólamente ${primerReceta.longitud()}`);
    }
}



// Creación de arrays de comidas vegetarianas, comidas rápidas y tiempo total para cocinar todas las recetas
const comidasVegetarianas = (listadoRecetas.filter((val) => val.recetaConCarne() == false)).map((el) => el.nombre);
const comidasRapidas = (listadoRecetas.filter((val) => val.tiempoDeCoccion <= 20)).map((el) => el.nombre);
const tiempoTotalDeCocina = (listadoRecetas.map((val) => val.tiempoDeCoccion)).reduce((acc, el) => acc + el, 0);



alert(`El tiempo total para cocinar todas esas recetas es de ${tiempoTotalDeCocina} minutos`);



// Condicional para mostrar por alerta comidas vegetarianas y rápidas solo si el array contiene elementos
if (comidasVegetarianas.length != 0) {
    alert(`Las comidas aptas para vegetarianos son:\n${comidasVegetarianas.join(`\n`)}`);
}

if (comidasRapidas.length != 0) {
    alert(`Estas son las comidas más rápidas de cocinar:\n${comidasRapidas.join(`\n`)}`);
}



// El código a continuación crea un listado de los nombres de las recetas y adicionalmente le agrega un contador 1 -, 2-, etc según cuantas recetas hay
const contador = listadoRecetas.map((val) => val.nombre);
const contadorConRecetas = [];

for (let i = 0; i < contador.length; i++) {
    contadorConRecetas[i] = `${i + 1} - ${contador[i]}`;
}

*/



/*Lanzador de la función masDificilDeCocinar(), está dentro de un if, para que el usuario pueda elegir
que recetas comparar en el caso de que haya 3 o más, en el caso de ser 2 recetas las compara automáticamente
y en el caso que haya 1 o ninguna no efectua comparación
*/

/*
if (listadoRecetas.length > 2) {
    alert(`Usted ha seleccionado ${cantidadDeseada} recetas, vamos a comparar 2 de ellas para ver cual es más difícil de cocinar según sus ingredientes`);
    let comparacionReceta1 = listadoRecetas[(parseInt(prompt(`Ingrese el número de receta del 1 al ${cantidadDeseada}\n${contadorConRecetas.join("\n")}`)) - 1)];
    let comparacionReceta2 = listadoRecetas[(parseInt(prompt(`Ahora ingresá otro número diferente al anterior, del 1 al ${cantidadDeseada}\n${contadorConRecetas.join("\n")}`)) - 1)];
    masDificilDeCocinar(comparacionReceta1, comparacionReceta2);
} else if (listadoRecetas.length == 2) {
    alert(`Usted ha seleccionado ${cantidadDeseada} recetas, a continuación compararemos cuál es más difícil de cocinar en base a sus ingredientes`);
    masDificilDeCocinar(listadoRecetas[0], listadoRecetas[1]);
} else {
    alert("No se ingresaron las suficientes recetas para realizar una comparación");
}

*/
