// Tomo los elementos de los formularios de logueo y creación de cuenta
const formularioAcceso = document.getElementById("formularioAcceso");
const formularioRegistro = document.getElementById("formularioRegistro");


// Obtengo del localStorage si existen usuarios creados previamente, si no inicializo el array
const usuariosRegistrados = JSON.parse(localStorage.getItem('username')) || [];


//Se usa el operador AND para comprobar que no haya error por null al traer los form (ya que son 2 html distintos)
formularioAcceso != null && formularioAcceso.addEventListener("submit", loguearse);
formularioRegistro != null && formularioRegistro.addEventListener("submit", crearCuenta);





// Función para crear la cuenta
function crearCuenta(e) {
    e.preventDefault();

    // Obtengo los valores que ingresa el usuario
    let nombreDeUsuario = document.getElementById("username");
    let email = document.getElementById("email");
    let pass = document.getElementById("password");

    // Creo el objeto y lo pusheo al array
    const user = {
        email: email.value,
        nombreDeUsuario: nombreDeUsuario.value,
        pass: pass.value
    }
    usuariosRegistrados.push(user);

    // Envio al local
    const json = JSON.stringify(usuariosRegistrados);
    localStorage.setItem("username", json);

    // Notifico creación ok
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'El usuario se cargó correctamente',
        showConfirmButton: false,
        timer: 1500
    });

    // Reseteo los valores
    nombreDeUsuario.value = "";
    email.value = "";
    pass.value ="";

    // Pongo un delay de 2 segundos para emular el almacenamiento en la base de satos y envío al idex para que se loguee
    setTimeout(() =>{
        window.location = '../index.html';
    },2000);
}


// Función para loguearse con cuenta ya existente
function loguearse(e) {
    e.preventDefault();

    // Obtengo los valores que ingresa el usuario
    const nombreDeUsuario = document.getElementById("username").value;
    const pass = document.getElementById("password").value;


    //Validación para permitir o no el acceso según exista el usuario y contraseña
    if (usuariosRegistrados == []) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Usuario / Contraseña incorrecta',
            confirmButtonText: 'Reintentar',
            timer: 1500
        });
    } else if (usuariosRegistrados.some((val) => val.nombreDeUsuario == nombreDeUsuario && val.pass == pass)) {
        // Le permito el acceso enviandolo al sesion.html
        window.location = 'pages/sesion.html'
    } else {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Usuario / Contraseña incorrecta',
            confirmButtonText: 'Reintentar',
            timer: 1500
        });
    }


}
