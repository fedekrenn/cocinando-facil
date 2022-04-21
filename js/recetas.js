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
    recetaConCarne() {                                // Método para saber si la receta tiene carne
        let listaDeCarne = ["carne", "pollo", "pescado", "jamon", "salchicha", "salame", "atun"];
        return (this.ingredientes).some((val) => listaDeCarne.includes(val.toLowerCase()));
    }
}


// Arrays y objeto, son definidos con let y no con const ya que posteriormente se modifican(borrado para nueva carga)
let dificultadRecetas = [];
let recetasAComparar = [];
let listadoDeRecetas = [];
let nuevaReceta = {};





// Obtengo lo almacenado en localStore en caso de que exista algun dato, uso el operador avanzado lógico OR para que cree el array en caso de que no haya nada
const baseDeDatos = JSON.parse(localStorage.getItem('recetas guardadas')) || [];

// Cuando se carga la página llamo a la función que trae las recetas guardadas en el Local Storage
window.onload = imprimirReceta(baseDeDatos), guardadoDeRecetas();




// Obtengo Elementos del dom
const formulario = document.getElementById("formulario");
const nombreReceta = document.getElementById("nombreReceta");
const cantidadIngredientes = document.getElementById("cantidadIngredientes");
const tiempoReceta = document.getElementById("tiempoCocina");
const divContenedorTablaRecetas = document.querySelector(".creadorCantidadRecetas");
const resultadoContainer = document.getElementById("resultadoContainer");

// Obtengo botones
const borrarTodo = document.querySelector(".borrarTodo");
const deleteButton = document.querySelector(".delete");
const compareButton = document.querySelector(".compare");
const botonSwitch = document.querySelector("#switch");
const botonDeBusqueda = document.querySelector("#search-btn");




// Ejecución de funciones según clicks o cambios del usuario
cantidadIngredientes.addEventListener("change", crearInputs);
formulario.addEventListener("submit", agregarRecetaATabla);
borrarTodo.addEventListener("click", borrarTotalTablaRecetas);
compareButton.addEventListener("click", comparandoRecetas);
botonDeBusqueda.addEventListener("click", obtenerRecetasDeApi);
cantidadIngredientes.addEventListener("blur", () => {
    Toastify({
        text: "Si la receta lleva carne, no olvides cargarla",
        duration: 3000,
        style: {
            background: "linear-gradient(to right, #800080, #f37ef3)",
        },
    }).showToast();
});



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

    // Ejecuto antes que nada la función de borrado para que, si hay previamente ingredientes cargados, sean borrados
    borrarInputs();

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
function agregarRecetaATabla(e) {

    // Reseteo de evento default
    e.preventDefault();

    // Cada ingrediente está en un input individual, por lo que con este código los recojo y envío a arrayIngredientes
    const listadoIngredientes = document.querySelectorAll(".areaIngrediente");
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
    enviarALocal()
}


function guardadoDeRecetas() {

    // Aquí vacío el array, para evitar que si da muchas veces al boton "Guardar receta", se multipliquen valores
    listadoDeRecetas = [];

    // Obtengo los valores de las recetas que el usuario cargó.
    const nombre = document.getElementsByClassName("nombreRecetaGuardada");
    const ingredientes = document.getElementsByClassName("recetaIngredientesGuardada");
    const tiempo = document.getElementsByClassName("recetaTiemposGuardada");


    // Ciclo que pushea toda la info al array listadoDeRecetas
    for (let i = 0; i < ingredientes.length; i++) {

        // Función que obtiene los ingredientes en forma string y los lista en un array
        function convertirEnArray() {
            const obtenerIngredientes = ingredientes[i].textContent;
            return obtenerIngredientes.split(", ");
        }

        // Tomando los elementos del html creo el listado de recetas que serán guardados en el localStorage
        listadoDeRecetas.push(new Recetas(nombre[i].textContent, convertirEnArray(), parseInt(tiempo[i].textContent)));
    }

    // Convierto en string y envio al localStorage
    const recetasJSON = JSON.stringify(listadoDeRecetas);
    localStorage.setItem("recetas guardadas", recetasJSON);

    // Copio el array original a otros 2 ya que "listadoDeRecetas" será vaciado. Estos array de copia es para posteriormente generar el calculador de dificultad.
    dificultadRecetas = [...listadoDeRecetas];
    recetasAComparar = [...listadoDeRecetas];
    listadoDeRecetas = [];

    // Ejecuto la función que crea las opciones de lista desplegable para el comparador
    generarSelectIngredientes();
}



/* Con esta función, llamo a guardadoDeRecetas() pero agrego el sweet alert para mostrar la confirmación al usuario,
desglosarla en funciones apartes me sirve para llamar a guardadoDeRecetas() sin la notificación cuando se carga la página */

function enviarALocal() {

    guardadoDeRecetas();

    // Alerta de carga correcta
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'La receta se guardó correctamente!',
        showConfirmButton: false,
        timer: 1500
    })
}


function borrarTotalTablaRecetas() {

    Swal.fire({
        title: '¿Seguro de borrar todas las recetas?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar todas',
        cancelButtonText: 'No, conservarlas'
    }).then((result) => {

        if (result.isConfirmed) {
            Swal.fire({
                title: 'Borrado exitoso!',
                icon: 'success',
                text: 'Eliminaste todas las recetas'
            });
            const cuerpoTabla = document.querySelector(".tbody");
            cuerpoTabla.innerHTML = "";
            guardadoDeRecetas();
        }
    });
}


/* Aplicamos cada receta a la tabla, se pasa un parámetro ya que lo reutilizo dependiendo el array, primero para
 crear las recetas que el usuario va cargando y luego para lo que está en el local storage */
function imprimirReceta(array) {

    const cuerpoTabla = document.querySelector(".tbody");

    for (const i of array) {
        const tabla = document.createElement("tr");

        tabla.innerHTML = `<td class="nombreRecetaGuardada">${i.nombre}</td>
                           <td class="recetaIngredientesGuardada">${(i.ingredientes).join(", ")}</td>
                           <td class="recetaTiemposGuardada">${i.tiempoDeCoccion}</td>
                           <td><i class="fa-solid fa-trash botonBorrado"></i></td>`;

        cuerpoTabla.appendChild(tabla);

        // Evento de borrado de receta en tabla (icono tacho basura), se declara en este scoope ya que se puede ejecutar luego de crear un elemento
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
                guardadoDeRecetas();
            }
        });
    }

    // Reseteo el array, ya que si no cuando se da a guardar se crean muchas veces tablas con recetas repetidas
    listadoDeRecetas = [];
}

function generarSelectIngredientes() {

    // Borro lo previamente cargado para que cuando se apriete el botón no haya opciones duplicadas
    removerComparacion();

    // Obtengo del dom los valores de la etiqueta select
    const cuerpoSelect1 = document.getElementById("primerComparador");
    const cuerpoSelect2 = document.getElementById("segundoComparador");

    // Genero la etiqueta option, logrando que la lista desplegable tenga todas las recetas que se guardaron antes
    for (let i = 0; i < dificultadRecetas.length; i++) {
        cuerpoSelect1.innerHTML += `<option value="${dificultadRecetas[i].nombre}">${dificultadRecetas[i].nombre}</option>`;
        cuerpoSelect2.innerHTML += `<option value="${dificultadRecetas[i].nombre}">${dificultadRecetas[i].nombre}</option>`;
    }


    /* COMIDAS VEGETARIANAS Y RÁPIDAS */


    // Creación de arrays, uno de comidas vegetarianas y otro para comidas rápidas usando métodos para que sólo se sumen las que yo quiero
    // Filter busca por el tiempo de cocción y el método de la clase (para saber si tiene carne) y con map obtengo solo el nombre y no todo el objeto
    const comidasVegetarianas = (dificultadRecetas.filter((val) => val.recetaConCarne() == false)).map((el) => el.nombre);
    const comidasRapidas = (dificultadRecetas.filter((val) => val.tiempoDeCoccion <= 15)).map((el) => el.nombre);

    // Obtengo del DOM los div donde los ubicaré
    const cuerpoComidasVegetarianas = document.getElementById("comidasVegetarianas");
    const cuerpoComidasRapidas = document.getElementById("comidasRapidas");

    // Reseteo lo que ya existe
    cuerpoComidasVegetarianas.innerHTML = "";
    cuerpoComidasRapidas.innerHTML = "";

    // Aplico el <li> de cada receta, con un operador ternario que verifica que haya recetas en los array
    comidasVegetarianas.length != 0 ? comidasVegetarianas.forEach((receta) => cuerpoComidasVegetarianas.innerHTML += `<li>${receta}</li>`) : cuerpoComidasVegetarianas.innerHTML = `<li class="noIcon">No hay comidas aptas para vegetarianos</li>`;
    comidasRapidas.length != 0 ? comidasRapidas.forEach((receta) => cuerpoComidasRapidas.innerHTML += `<li>${receta}</li>`) : cuerpoComidasRapidas.innerHTML = `<li class="noIcon">No hay comidas rápidas de cocinar</li>`;

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

    //Comparación de la cantidad de ingredientes para determinar cuál receta es más complicada de cocinar, se usa el método .longitud() del objeto 
    if ($recetaUno[0] == $recetaDos[0]) {
        Swal.fire({
            title: 'Error!',
            text: 'Las recetas tienen que ser diferentes para poder compararse',
            icon: 'error',
            confirmButtonText: 'Reintentar'
        });
    } else if ($recetaUno[0].longitud() == $recetaDos[0].longitud()) {
        Swal.fire({
            text: 'Ya que ambas recetas tienen la misma cantidad de ingredientes, cocinarlas conllevan la misma dificultad',
            icon: 'success',
            confirmButtonText: 'Seguir comparando'
        });
    } else if (($recetaUno[0].longitud()) > ($recetaDos[0].longitud())) {
        resultadoComparacion($recetaUno[0], $recetaDos[0]);
    } else {
        resultadoComparacion($recetaDos[0], $recetaUno[0]);
    }


    //Función para la notificación con el resultado de la comparación
    function resultadoComparacion(uno, dos) {
        Swal.fire({
            text: `Cocinar ${(uno.nombre).toLowerCase()} es más difícil ya que lleva ${uno.longitud()} ingredientes, en cambio ${(dos.nombre).toLowerCase()} lleva sólamente ${dos.longitud()}`,
            icon: 'success',
            confirmButtonText: 'Seguir comparando'
        })
    }
}


function aplicarModoOscuro() {

    // Seteamos clases en el html
    document.body.classList.toggle("dark");
    botonSwitch.classList.toggle("active");

    // Guardamos el modo en local storage con un ternario
    document.body.classList.contains("dark") ? localStorage.setItem("dark-mode", "true") : localStorage.setItem("dark-mode", "false");

}


async function obtenerRecetasDeApi(e) {
    e.preventDefault();

    //Obtengo lo que el usuario desea buscar
    const textoBusqueda = document.getElementById("buscadorRecetas").value.trim();

    //Llamo a la api de recetas "Edaman" y almaceno la info en la constante datosObtenidos
    const llamadoApi = await fetch(`https://api.edamam.com/search?q=${textoBusqueda}&app_id=3f9e6bb6&app_key=f5c476faed9ba3c9819e87e79f9e90e0`);
    const datosObtenidos = await llamadoApi.json();
    let html = "";

    // Ciclo que por cada receta que encontró en la Api imprime en el DOM la card con c/u.
    for (const receta of datosObtenidos.hits) {

        // Creo una lista de ingredientes
        const listaIngredientesApi = [];
        // Dentro de cada receta en la api hay arrays con ingredientes pero que son objetos con más propiedades internas, por lo que lo pusheo a mi lista sólo los nombres
        receta.recipe.ingredients.forEach((ing) => listaIngredientesApi.push(ing.text));

        // Aplico al html lo generado
        html += `<div class="itemReceta">
                    <img src="${receta.recipe.image}" alt="comida">
                    <h3>${receta.recipe.label}</h3>
                    <h4>Ingredientes:</h4>
                    <p>${listaIngredientesApi.join("<br><br>")}</p>
                </div>`;
    }
    resultadoContainer.innerHTML = html;
}