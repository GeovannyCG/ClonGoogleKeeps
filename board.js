//Elementos
const notesContainer = document.querySelector("#notes-container");
const noteInput = document.querySelector("#note-content");
const addNoteBtn = document.querySelector(".add-note");
const header = document.querySelector("#header-app");

//Funciones
function showNotes() {
    cleanNotes();

    getNotes().forEach((note) => {
        if (note.user === localStorage.getItem("session")) {
            const noteElement = createNote(note.id, note.content, note.fixed);
            notesContainer.appendChild(noteElement);
        }
    });
}

function cleanNotes() {
    notesContainer.replaceChildren([]);
}

function addNote() {
    const notes = getNotes();

    const noteObject = {
        id: generateId(),
        content: noteInput.value,
        fixed: false,
        user: localStorage.getItem("session"),
    };

    const noteElement = createNote(noteObject.id, noteObject.content);

    notesContainer.appendChild(noteElement);

    notes.push(noteObject);
    saveNotes(notes);
    noteInput.value = "";
}

function generateId() {
    return Math.floor(Math.random() * 5000);
}

function createNote(id, content, fixed) {
    const element = document.createElement("div");
    element.classList.add("note");
    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.disabled = true;
    textarea.placeholder = "Adicione algum texto....";
    element.appendChild(textarea);

    const pinIcon = document.createElement("i");
    pinIcon.classList.add(...["bi", "bi-pin"]);
    element.appendChild(pinIcon);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add(...["bi", "bi-x-lg"]);
    element.appendChild(deleteIcon);

    const duplicateIcon = document.createElement("i");
    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);
    element.appendChild(duplicateIcon);

    if (fixed) {
        element.classList.add("fixed");
    }
    //Eventos do elemento
    element.querySelector(".bi-pin").addEventListener("click", () => {
        toggleFixNote(id);
    });

    element.querySelector(".bi-x-lg").addEventListener("click", () => {
        deleteNote(id, element);
    });

    element
        .querySelector(".bi-file-earmark-plus")
        .addEventListener("click", () => {
            copyNote(id);
        });

    return element;
}

function toggleFixNote(id) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes);

    showNotes();
}

function deleteNote(id, element) {
    const notes = getNotes().filter((note) => note.id !== id);
    saveNotes(notes);
    notesContainer.removeChild(element);
}

function copyNote(id) {
    const notes = getNotes();
    const targetNote = notes.filter((note) => note.id === id)[0];
    const noteObject = {
        id: generateId(),
        content: targetNote.content,
        fixed: false,
        user: localStorage.getItem("session"),
    };

    const noteElement = createNote(
        noteObject.id,
        noteObject.content,
        noteObject.fixed
    );
    notesContainer.appendChild(noteElement);
    notes.push(noteObject);
    saveNotes(notes);
}

//Local storage
function getNotes() {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));
    return orderedNotes;
}

function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

//Funcion para determinar que header mostrar
function headerConfig(screen) {
    //Agreado !!!
    if (screen >= 600) {
        header.innerHTML = `
        <img src="./assets/images/logo-login-darkmode-1.png" alt="Keep" width="100px" height="auto">
        <div id="search-container">
            <div class="input-group mb-1">
                <input type="text" id="serach-input" style="width: 400px;" class="form-control" placeholder="Buscar nota..." aria-describedby="button-addon2">
                <button class="btn btn-outline-secondary" type="button" id="button-addon2"><i id="btnReset" class="bi bi-search"></i></button>
            </div>
        </div>
        <div class="dropdown">
            <a class="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown" aria-expanded="false">
                <img src="./assets/images/user.jpg" alt="" width="32" height="32" class="rounded-circle me-2">
                <strong id="nombreUsuario" style="color: white;"></strong>
            </a>
            <ul class="dropdown-menu text-small shadow" style="background-color: #202124; border: 1px solid white ;">
                <li><a id="btnCerrarsesion" class="dropdown-item" style="color: red;"><i class='bx bx-power-off'
                            style='color:#ff0303'></i> Cerrar Sesion</a></li>
            </ul>
        </div>
    `;
    } else {
        header.innerHTML = `
        <div id="header-part-1">
            <img src="./assets/images/logo-login-darkmode-1.png" alt="Keep" width="100px" height="auto">

            <div class="dropdown">
                <a class="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="./assets/images/user.jpg" alt="" width="32" height="32" class="rounded-circle me-2">
                    <strong id="nombreUsuario" style="color: white;"></strong>
                </a>
                <ul class="dropdown-menu text-small shadow" style="background-color: #202124; border: 1px solid white ;">

                    <li><a id="btnCerrarsesion" class="dropdown-item" style="color: red;"><i class='bx bx-power-off'
                                style='color:#ff0303'></i> Cerrar Sesion</a></li>
                </ul>
            </div>
        </div>
        <div id="header-part-2">
            <div id="search-container">
                <div class="input-group mb-1">
                    <input type="text" id="serach-input" style="width: 200px;" class="form-control" placeholder="Buscar nota..." aria-describedby="button-addon2">
                    <button class="btn btn-outline-secondary" type="button" id="button-addon2"><i id="btnReset" class="bi bi-search"></i></button>
                </div>
            </div>
        </div>
    `;
    }
}

//Funcion para realizar busqueda de notas
function searchNote(user, content) {
    cleanNotes();

    getNotes().forEach((note) => {
        if (note.user === user && note.content === content) {
            const noteElement = createNote(note.id, note.content, note.fixed);
            notesContainer.appendChild(noteElement);
        }
    });
}

//Funcion para cambiar el boton de busqueda por el boton de resetaear busquedas
function btnSearch(name, note) {
    let icono = document.getElementById("btnReset");
    if (icono.getAttribute("class") === 'bi bi-search') {
        searchNote(name, note);
        icono.classList.remove("bi", "bi-search");
        icono.classList.add("bi", "bi-x");

    } else if (icono.getAttribute("class") === 'bi bi-x') {
        icono.classList.remove("bi", "bi-x");
        icono.classList.add("bi", "bi-search");
        document.getElementById("serach-input").value = "";
        showNotes();
    }
}

//Eventos
addNoteBtn.addEventListener("click", () => addNote());
showNotes();

document.addEventListener("DOMContentLoaded", () => {
    //Agreado !!!
    let screenSize = innerWidth;
    headerConfig(screenSize);

    document.getElementById("nombreUsuario").textContent =
        localStorage.getItem("session");
    const cerrarSesion = document.getElementById("btnCerrarsesion");

    cerrarSesion.addEventListener("click", () => {
        localStorage.removeItem("session");
        location.href = "./index.html";
    });

    document.getElementById("button-addon2").addEventListener("click", () => {
        btnSearch(localStorage.getItem("session"), document.getElementById("serach-input").value);
    });
});
