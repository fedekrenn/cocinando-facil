//Clase constructora que me permite crear un listado de recetas
class Receta {
    constructor(nombre, ingredientes, tiempoDeCoccion) {
        this.nombre = nombre;
        this.ingredientes = ingredientes;
        this.tiempoDeCoccion = tiempoDeCoccion;
    }
    longitud() {                                      //Método para conocer cantidad de ingredientes
        return (this.ingredientes).length;
    }
    recetaConCarne(){                                 //Método para saber si la receta tiene carne
        return (this.ingredientes).some((val) => val == "carne" || val == "Carne");    
    }
}


//Arrays
const listadoRecetas = [];
const comidasVeganas = [];
const comidasRapidas = [];
const tiempoTotalDeCocina = [];


//FUNCIONES

//Función que crea un array con la longitud y detalle de ingredientes que el usuario elija
function agregadorIngredientes() {
    let cantidad = parseInt(prompt("¿Cuántos ingredientes tiene?"));
    const nuevoIngrediente = [];
    for (let i = 0; i < cantidad; i++) {
        nuevoIngrediente.push(prompt("Escribe el ingrediente"));
    }
    return nuevoIngrediente.sort();         //Los acomodo alfabéticamente con sort
}

//Función que crea un array con las recetas que no tengan carne
function recetasVegetarianas(){
    listadoRecetas.forEach((element) => {
        if (!element.recetaConCarne()) { // Niego con "!" el true del boleano, para obener las que NO tienen carne
            comidasVeganas.push(element.nombre);
        }
    });
}

// Función que crea un array con las recetas que tengan tiempo de cocción menor a 20 minutos
function agregarComidaRapida(){
    listadoRecetas.forEach((element) => {
        if (element.tiempoDeCoccion <= 20) {
            comidasRapidas.push(element.nombre);
        }
    })
}

//Función con la que sumaré el tiempo de preparación de todas las recetas
function calcularTiempoTotal(){
    for (const tiempos of listadoRecetas) {
        tiempoTotalDeCocina.push(tiempos.tiempoDeCoccion);
    }
    return tiempoTotalDeCocina.reduce((acc, el) => acc + el, 0);
}







// Creación de c/u de las recetas, con un ciclo para poder obtener las deseadas por el usuario
let cantidadDeseada = parseInt(prompt("¿Cuántas recetas le gustaría ingresar?"));

for (let i = 0; i < cantidadDeseada; i++) {
    listadoRecetas.push(new Receta(prompt("Nombre de la receta:"), agregadorIngredientes(), parseInt(prompt("Cuanto tiempo en minutos demora su preparación?"))));
}





// Lanzo las funciones y muestro alertas por pantalla
recetasVegetarianas();
agregarComidaRapida();
alert(`El tiempo total para cocinar todas esas recetas es de ${calcularTiempoTotal()} minutos`);
alert(`Las comidas aptas para vegetarianos son:\n${comidasVeganas.join(`\n`)}`);
alert(`Estas son las comidas más rápidas de cocinar:\n${comidasRapidas.join(`\n`)}`);
























//La siguiente función compara la cantidad de ingredientes para determinar cuál receta es más complicada de cocinar
//Se usa length para esto, pero se creó como un método en la clase constructora para que sea más ágil llamarla
function masDificilDeCocinar(primerReceta, segundaReceta) {
    if ((primerReceta.longitud()) > (segundaReceta.longitud())) {
        alert(`Cocinar ${primerReceta.nombre} es más difícil ya que lleva ${primerReceta.longitud()} ingredientes`);
    } else {
        alert(`Cocinar ${segundaReceta.nombre} es más difícil ya que lleva ${segundaReceta.longitud()} ingredientes`);
    }
}

//acá se pueden colocar las 2 recetas que se quieran comparar, por ejemplo la 3 y la 1

// masDificilDeCocinar(receta3, receta1);


