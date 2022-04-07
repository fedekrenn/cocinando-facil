let formularioAcceso = document.getElementById("formularioAcceso");
let formularioRegistro = document.getElementById("formularioRegistro");


if (formularioAcceso != null) {
    formularioAcceso.addEventListener("submit", loguearse);
}
if (formularioRegistro != null){
    formularioRegistro.addEventListener("submit", crearCuenta);
}



function crearCuenta(e){
    event.preventDefault();


    let nombreDeUsuario = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    let user = {
        email: email,
        nombreDeUsuario: nombreDeUsuario,
        pass: pass
    }

    let json = JSON.stringify(user);
    localStorage.setItem(username, json);
    alert("Usuario agregado");
    window.location = '../index.html'
}

function loguearse(e){
    event.preventDefault();

    let nombreDeUsuario = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    let user = localStorage.getItem(username);
    let datos = JSON.parse(user);

    
    if (nombreDeUsuario == datos.nombreDeUsuario && pass == datos.pass){
        window.location = 'pages/sesion.html'
    } else {
        alert("Mmmm, no maestro");
    }
}