class Recetas {
  constructor(nombre, ingredientes, tiempoDeCoccion) {
    this.nombre = nombre;
    this.ingredientes = ingredientes;
    this.tiempoDeCoccion = tiempoDeCoccion;
  }
  longitud() {
    return this.ingredientes.length;
  }
  recetaConCarne() {
    let listaDeCarne = [
      "carne",
      "pollo",
      "pescado",
      "jamon",
      "salchicha",
      "salame",
      "atun",
    ];
    return this.ingredientes.some((val) =>
      listaDeCarne.includes(val.toLowerCase())
    );
  }
}

let dificultadRecetas = [];
let recetasAComparar = [];
let listadoDeRecetas = [];
let nuevaReceta = {};

const baseDeDatos = JSON.parse(localStorage.getItem("recetas guardadas")) || [];

(window.onload = imprimirReceta(baseDeDatos)), guardadoDeRecetas();

const formulario = document.getElementById("formulario");
const nombreReceta = document.getElementById("nombreReceta");
const cantidadIngredientes = document.getElementById("cantidadIngredientes");
const tiempoReceta = document.getElementById("tiempoCocina");
const divContenedorTablaRecetas = document.querySelector(
  ".creadorCantidadRecetas"
);
const resultadoContainer = document.getElementById("resultadoContainer");

const borrarTodo = document.querySelector(".borrarTodo");
const deleteButton = document.querySelector(".delete");
const compareButton = document.querySelector(".compare");
const botonSwitch = document.querySelector("#switch");
const botonDeBusqueda = document.querySelector("#search-btn");

cantidadIngredientes.addEventListener("change", crearInputs);
formulario.addEventListener("submit", agregarRecetaATabla);
borrarTodo.addEventListener("click", borrarTotalTablaRecetas);
compareButton.addEventListener("click", comparandoRecetas);
botonDeBusqueda.addEventListener("click", getRecipesFromApi);
cantidadIngredientes.addEventListener("blur", () => {
  Toastify({
    text: "Si la receta lleva carne, no olvides cargarla",
    duration: 3000,
    style: {
      background: "linear-gradient(to right, #800080, #f37ef3)",
    },
  }).showToast();
});

botonSwitch.addEventListener("click", aplicarModoOscuro);

if (localStorage.getItem("dark-mode") === "true") {
  document.body.classList.toggle("dark");
  botonSwitch.classList.toggle("active");
} else {
  document.body.classList.remove("dark");
  botonSwitch.classList.remove("active");
}

function crearInputs() {
  borrarInputs();

  for (let i = 0; i < cantidadIngredientes.value; i++) {
    divContenedorTablaRecetas.innerHTML += `<input type="text" class="areaIngrediente" placeholder="Ingrediente ${
      i + 1
    }" required>`;
  }
}

function borrarInputs() {
  const borradoIngredientes = document.querySelectorAll(".areaIngrediente");
  borradoIngredientes.forEach((element) => element.remove());
}

function agregarRecetaATabla(e) {
  e.preventDefault();

  const listadoIngredientes = document.querySelectorAll(".areaIngrediente");
  const arrayIngredientes = [];
  listadoIngredientes.forEach((ingrediente) =>
    arrayIngredientes.push(ingrediente.value)
  );

  nuevaReceta = new Recetas(
    nombreReceta.value,
    arrayIngredientes,
    tiempoReceta.value
  );

  listadoDeRecetas.push(nuevaReceta);

  imprimirReceta(listadoDeRecetas);

  nombreReceta.value = "";
  cantidadIngredientes.value = "";
  tiempoReceta.value = "";

  borrarInputs();
  confirmacionDeGuardado();
}

function confirmacionDeGuardado() {
  guardadoDeRecetas();

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "La receta se guardó correctamente!",
    showConfirmButton: false,
    timer: 1500,
  });
}

function guardadoDeRecetas() {
  listadoDeRecetas = [];

  const nombre = document.getElementsByClassName("nombreRecetaGuardada");
  const ingredientes = document.getElementsByClassName("recetaIngredientesGuardada");
  const tiempo = document.getElementsByClassName("recetaTiemposGuardada");

  for (let i = 0; i < ingredientes.length; i++) {
    function convertirEnArray() {
      const obtenerIngredientes = ingredientes[i].textContent;
      return obtenerIngredientes.split(", ");
    }

    listadoDeRecetas.push(
      new Recetas(
        nombre[i].textContent,
        convertirEnArray(),
        parseInt(tiempo[i].textContent)
      )
    );
  }

  const recetasJSON = JSON.stringify(listadoDeRecetas);
  localStorage.setItem("recetas guardadas", recetasJSON);

  dificultadRecetas = [...listadoDeRecetas];
  recetasAComparar = [...listadoDeRecetas];
  listadoDeRecetas = [];

  generarSelectIngredientes();
}

function imprimirReceta(array) {
  const cuerpoTabla = document.querySelector(".tbody");

  for (const i of array) {
    const tabla = document.createElement("tr");

    tabla.innerHTML = `
      <td class="nombreRecetaGuardada">${i.nombre}</td>
      <td class="recetaIngredientesGuardada">${i.ingredientes.join(", ")}</td>
      <td class="recetaTiemposGuardada">${i.tiempoDeCoccion}</td>
      <td><i class="fa-solid fa-trash botonBorrado"></i></td>
    `;

    cuerpoTabla.appendChild(tabla);

    tabla
      .querySelector(".botonBorrado")
      .addEventListener("click", eliminarRecetaIndividual);
  }

  function eliminarRecetaIndividual(event) {
    Swal.fire({
      title: "Está seguro de eliminar la receta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, me arrepentí",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Receta Borrada!",
          icon: "success",
          text: "La receta ha sido borrada",
        });
        const botonApretado = event.target;
        botonApretado.closest("tr").remove();
        guardadoDeRecetas();
      }
    });
  }

  listadoDeRecetas = [];
}

function borrarTotalTablaRecetas() {
  Swal.fire({
    title: "¿Seguro de borrar todas las recetas?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar todas",
    cancelButtonText: "No, conservarlas",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Borrado exitoso!",
        icon: "success",
        text: "Eliminaste todas las recetas",
      });
      const cuerpoTabla = document.querySelector(".tbody");
      cuerpoTabla.innerHTML = "";
      guardadoDeRecetas();
    }
  });
}

function generarSelectIngredientes() {
  removerComparacion();

  const cuerpoSelect1 = document.getElementById("primerComparador");
  const cuerpoSelect2 = document.getElementById("segundoComparador");

  for (let i = 0; i < dificultadRecetas.length; i++) {
    cuerpoSelect1.innerHTML += `<option value="${dificultadRecetas[i].nombre}">${dificultadRecetas[i].nombre}</option>`;
    cuerpoSelect2.innerHTML += `<option value="${dificultadRecetas[i].nombre}">${dificultadRecetas[i].nombre}</option>`;
  }

  const comidasVegetarianas = dificultadRecetas
    .filter((val) => val.recetaConCarne() == false)
    .map((el) => el.nombre);
  const comidasRapidas = dificultadRecetas
    .filter((val) => val.tiempoDeCoccion <= 15)
    .map((el) => el.nombre);

  const cuerpoComidasVegetarianas = document.getElementById(
    "comidasVegetarianas"
  );
  const cuerpoComidasRapidas = document.getElementById("comidasRapidas");

  cuerpoComidasVegetarianas.innerHTML = "";
  cuerpoComidasRapidas.innerHTML = "";

  comidasVegetarianas.length != 0
    ? comidasVegetarianas.forEach(
        (receta) =>
          (cuerpoComidasVegetarianas.innerHTML += `<li>${receta}</li>`)
      )
    : (cuerpoComidasVegetarianas.innerHTML = `<li class="noIcon">No hay comidas aptas para vegetarianos</li>`);
  comidasRapidas.length != 0
    ? comidasRapidas.forEach(
        (receta) => (cuerpoComidasRapidas.innerHTML += `<li>${receta}</li>`)
      )
    : (cuerpoComidasRapidas.innerHTML = `<li class="noIcon">No hay comidas rápidas de cocinar</li>`);

  dificultadRecetas = [];
}

function removerComparacion() {
  const cuerpoSelect1 = document.getElementById("primerComparador");
  const cuerpoSelect2 = document.getElementById("segundoComparador");

  cuerpoSelect1.innerHTML = "";
  cuerpoSelect2.innerHTML = "";
}

function comparandoRecetas() {
  const receta1 = document.getElementById("primerComparador");
  const receta2 = document.getElementById("segundoComparador");

  const $recetaUno = recetasAComparar.filter(
    (val) => val.nombre == receta1.value
  );
  const $recetaDos = recetasAComparar.filter(
    (val) => val.nombre == receta2.value
  );

  if ($recetaUno[0] == $recetaDos[0]) {
    Swal.fire({
      title: "Error!",
      text: "Las recetas tienen que ser diferentes para poder compararse",
      icon: "error",
      confirmButtonText: "Reintentar",
    });
  } else if ($recetaUno[0].longitud() == $recetaDos[0].longitud()) {
    Swal.fire({
      text: "Ya que ambas recetas tienen la misma cantidad de ingredientes, cocinarlas conllevan la misma dificultad",
      icon: "success",
      confirmButtonText: "Seguir comparando",
    });
  } else if ($recetaUno[0].longitud() > $recetaDos[0].longitud()) {
    resultadoComparacion($recetaUno[0], $recetaDos[0]);
  } else {
    resultadoComparacion($recetaDos[0], $recetaUno[0]);
  }

  function resultadoComparacion(uno, dos) {
    Swal.fire({
      text: `Cocinar ${uno.nombre.toLowerCase()} es más difícil ya que lleva ${uno.longitud()} ingredientes, en cambio ${dos.nombre.toLowerCase()} lleva sólamente ${dos.longitud()}`,
      icon: "success",
      confirmButtonText: "Seguir comparando",
    });
  }
}

function aplicarModoOscuro() {
  document.body.classList.toggle("dark");
  botonSwitch.classList.toggle("active");

  document.body.classList.contains("dark")
    ? localStorage.setItem("dark-mode", "true")
    : localStorage.setItem("dark-mode", "false");
}

async function getRecipesFromApi(e) {
  e.preventDefault();

  const searchQuery = document.getElementById("recipeSearch").value.trim();

  const res = await fetch(
    `https://api.edamam.com/search?q=${searchQuery}&app_id=3f9e6bb6&app_key=f5c476faed9ba3c9819e87e79f9e90e0`
  );

  const data = await res.json();
  let html = "";

  for (const recipeItem of data.hits) {
    const recipeIngredients = [];

    recipeItem.recipe.ingredients.forEach((ingredient) =>
      recipeIngredients.push(ingredient)
    );

    html += `
      <div class="itemReceta">
        <img src="${recipeItem.recipe.image}" alt="comida">
        <h3>${recipeItem.recipe.label}</h3>
        <ul>
          ${recipeIngredients.slice(0, 10).map((ingredient) => {
            return `<li><img src="${ingredient.image}" alt="${ingredient.food}"> ${ingredient.text}</li>`
          }).join("")}
        </ul>
      </div>
    `;
  }

  resultadoContainer.innerHTML = html;
}
