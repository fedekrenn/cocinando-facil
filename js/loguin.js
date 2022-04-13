// Tomo los elementos de los formularios de logueo y creación de cuenta
let formularioAcceso = document.getElementById("formularioAcceso");
let formularioRegistro = document.getElementById("formularioRegistro");


// Creación de array con todos los usuarios que se van creando
let usuariosRegistrados = [];


//Se usa el operador AND para comprobar que no haya error por null al traer los form (ya que son 2 html distintos)
formularioAcceso != null && formularioAcceso.addEventListener("submit", loguearse);
formularioRegistro != null && formularioRegistro.addEventListener("submit", crearCuenta);






function crearCuenta(e) {
    e.preventDefault();

    let nombreDeUsuario = document.getElementById("username");
    let email = document.getElementById("email");
    let pass = document.getElementById("password");

    let user = {
        email: email.value,
        nombreDeUsuario: nombreDeUsuario.value,
        pass: pass.value
    }
    usuariosRegistrados.push(user);
  
    let json = JSON.stringify(usuariosRegistrados);
    localStorage.setItem("username", json);
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'El usuario se cargó correctamente',
        showConfirmButton: false,
        timer: 1500
    });

    nombreDeUsuario.value = "";
    email.value = "";
    pass.value ="";
}

function loguearse(e) {
    e.preventDefault();

    let nombreDeUsuario = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    let user = localStorage.getItem("username");
    let datos = JSON.parse(user);

    if (user == null) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Usuario / Contraseña incorrecta',
            confirmButtonText: 'Reintentar',
            timer: 1500
        });
    } else if (datos.some((val) => val.nombreDeUsuario == nombreDeUsuario) && datos.some((val) => val.pass == pass)) {
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
