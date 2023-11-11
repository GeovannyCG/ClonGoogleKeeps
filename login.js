/**
 * Usuarios registrados en la App y que podran acceder
 */

const usuarios = [
    {
        id: 1,
        correo: "hiojan75@gmail.com",
        contraseña: "mypass1234",
        nombre: "Hiojan",
    },
    {
        id: 2,
        correo: "gustavo3312@gmail.com",
        contraseña: "mypass123",
        nombre: "Gustavo",
    },
    {
        id: 3,
        correo: "hugo67@gmail.com",
        contraseña: "mypass12",
        nombre: "Hugo",
    },
];

/**
 * Elementos DOM en el login
 */

let correo = document.querySelector("#email");
let contraseña = document.querySelector("#password");
const btnIniciar = document.getElementById("btnIniciarSesion");

/**
 * Funciones
 */

function validarUsuario(usuario, contraseña) {
    let verificacion = false;
    for (let i = 0; i < usuarios.length; i++) {
        if (
            usuarios[i].correo === usuario.value &&
            usuarios[i].contraseña === contraseña.value
        ) {
            verificacion = true;
            localStorage.setItem("session", `${usuarios[i].nombre}`);
            location.href = "./board.html";
            break;
        }
    }

    if (verificacion == false) {
        Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "Correo o contraseña incorrectos",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
                title: 'small-title',
            },
        });
    }
}

/**
 * Eventos de la pantalla
 */
btnIniciar.addEventListener("click", () => {
    validarUsuario(correo, contraseña);
});

document.getElementById("exampleCheck1").addEventListener("change", () => {
    if (document.getElementById("exampleCheck1").checked) {
        // Si el elemento tiene el estado Checked se cambia el type del password input a text.
        contraseña.type = "text";
    } else {
        // Si el elemento no tiene el estado Checked se cambia el type del password input a password .
        contraseña.type = "password";
    }
});


