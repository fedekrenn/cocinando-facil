class Receta {
    constructor(nombre, ingredientes, tiempoDeCoccion) {
        this.nombre = nombre;
        this.ingredientes = ingredientes;
        this.tiempoDeCoccion = tiempoDeCoccion;
    }
    longitud() {
        return (this.ingredientes).length;
    }
}

function agregadorIngredientes() {
    let cantidad = parseInt(prompt("¿Cuántos ingredientes tiene?"));
    const nuevoIngrediente = [];
    for (let i = 0; i < cantidad; i++) {
        nuevoIngrediente.push(prompt("Escribe el ingrediente"));
    }
    return nuevoIngrediente;
}

let cantidadDeseada = parseInt(prompt("¿Cuántas recetas le gustaría ingresar?"));
const listadoRecetas = [];

for (let i = 0; i < cantidadDeseada; i++) {
    listadoRecetas.push(new Receta(prompt("Nombre de la receta:"), agregadorIngredientes(), parseInt(prompt("Cuanto tiempo en minutos demora su preparación?"))));
}




// Acá creo un nuevo array con todos los objetos creados y con el FOR OF muestro por consola los nombre de receta de c/u

for (const totalRecetas of listadoRecetas) {
    console.log(totalRecetas.nombre)
}


// // La siguiente función compara la cantidad de ingredientes para determinar cuál receta es más complicada de cocinar
// // Se usa length para esto, pero se creó como un método en la clase constructora para que sea más ágil llamarla

function masDificilDeCocinar(primerReceta, segundaReceta) {
    if ((primerReceta.longitud()) > (segundaReceta.longitud())) {
        alert(`Cocinar ${primerReceta.nombre} es más difícil ya que lleva ${primerReceta.longitud()} ingredientes`);
    } else {
        alert(`Cocinar ${segundaReceta.nombre} es más difícil ya que lleva ${segundaReceta.longitud()} ingredientes`);
    }
}

//acá se pueden colocar las 2 recetas que se quieran comparar, por ejemplo la 3 y la 1

// masDificilDeCocinar(receta3, receta1);

// Esta otra función añade en un nuevo array sólo las r1ecetas que tengan tiempo de cocción menor a 20 minutos y las muestra por alert

const comidasRapidas = [];

function agregarComidaRapida(receta) {
    if (receta.tiempoDeCoccion <= 20) {
        comidasRapidas.push(receta.nombre);
    }
}

// Este for of lo que hace es recorrer el array en la línea 19 y por cada elemento ejecuta la función agregarComidaRapida para que se agregue a un nuevo array

for (const a of listadoRecetas) {
    agregarComidaRapida(a);
}

alert("Estas son las comidas más rápidas de cocinar: \n" + comidasRapidas.join("\n"));