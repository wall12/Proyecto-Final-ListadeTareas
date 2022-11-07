const FECHA = document.getElementById('inputFecha');
const DESCRIP_TAREA = document.getElementById('descripTarea'); //tomar elemento por id
const NOM_TAREA = document.getElementById('nombreTarea');
const BTN_AGREGAR = document.getElementById('formAgregar');
const BTN_TEMA = document.getElementById('btnTema');
const ELEMENTS = document.getElementById("elements");
const FORM_AGREGAR = document.getElementById("agregarTarea");
const BTN_CERRAR = document.getElementById("btnCerrar");
let contadorID = 0;
let tema;
let fechaInicio = new Date();

//Formato
//2013-10-08T12:05:00//

let datosGuardados = [];
cargarDesdeLocalStorage();

// Mediante este event listener desplegamos el formulario para crear una tarea
FORM_AGREGAR.addEventListener('click', () => {
    setearFechaMinima();
    document.getElementById('contenedorFormulario').style.display = 'block';
    NOM_TAREA.focus();
    BTN_CERRAR.addEventListener('click', () => {
        document.getElementById('contenedorFormulario').style.display = 'none';
    })
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            document.getElementById('contenedorFormulario').style.display = 'none';

        }
    });
});

BTN_TEMA.addEventListener('click', () => {
    cambiarTema();
});

// Este event listener muestra el mensaje listo una vez que 
// se haya hecho el submit correctamente.
BTN_AGREGAR.addEventListener('submit', (evt) => {
    evt.preventDefault();
    agregarTarea(FECHA.value, DESCRIP_TAREA.value, NOM_TAREA.value);
    mostrarMensajeListo();
})

// Mediante esta funcion declaramos todas las variables que necesitamos
// y convertimos las fechas
// para luego guardar los datos
function agregarTarea(fecha, descripTarea, nombre) {
    fechaFin = new Date(fecha);
    let faltanDias = Math.abs(fechaFin - fechaInicio);
    faltanDias = Math.floor(faltanDias / (1000 * 3600 * 24));
    faltanHoras = fechaFin.getTime() - fechaInicio.getTime();
    faltanHoras = (Math.floor(faltanHoras / 3600000)) - (faltanDias * 24);
    guardarDatos(nombre, descripTarea, faltanDias, faltanHoras);
    FECHA.value = '';
    DESCRIP_TAREA.value = '';
    NOM_TAREA.value = '';
    document.getElementById('contenedorFormulario').style.display = 'none';
}

// Con esta funcion guardamos los datos que obtenemos de nuestros inputs en un arreglo
// y luego mediante la funcion actualizamos nuestro local storage.
function guardarDatos(nombre, descripTarea, fecha, horas) {
    let datos = {
        Id: contadorID,
        Nombre: nombre,
        Descripcion: descripTarea,
        Dias_Restantes: fecha,
        Horas_Restantes: horas,
    }
    datosGuardados.push(datos);
    contadorID++;
    actualizarLocalStorage();
    mostrarDato(datos);
}

// Esta funcion se utiliza al refrescar la pagina, para cargar los datos
// desde el localStorage, pregunta si el localStorage esta cargado y si es asi entonces muestra en pantalla
// los elementos
function cargarDesdeLocalStorage() {
    if (JSON.parse(localStorage.getItem('Datos')) !== null && JSON.parse(localStorage.getItem('ContadorID')) !== null) {
        datosGuardados = JSON.parse(localStorage.getItem('Datos'));
        contadorID = JSON.parse(localStorage.getItem('ContadorID'));
    }
    if (JSON.parse(localStorage.getItem('Tema')) !== null) {
        tema = JSON.parse(localStorage.getItem('Tema'));

    } else {
        tema = true;
        guardarTemaEnLS();
    }
    ponerTema();
    imprimirTareasEnPantalla();
}

function imprimirTareasEnPantalla() {
    //elemento para mostrar en pantalla
    datosGuardados.forEach(elements => {
        mostrarDato(elements);
    });
}

// Mediante esta funcion guardamos los datos en nuestro localStorage
function actualizarLocalStorage() {
    localStorage.setItem('Datos', JSON.stringify(datosGuardados));
    localStorage.setItem('ContadorID', JSON.stringify(contadorID));
}

// Esta funcion recibe "datos" como parametro, es el encargado de imprimir
// en nuestra web las tareas que vamos agregando
function mostrarDato(datos) {
    const DIV = document.createElement("div");
    const P_ELMNT = document.createElement("p");
    const TITULO = document.createElement("h3");
    const DESCRIPCION = document.createElement("p");
    DIV.className = "datosMostrados";
    DIV.id = datos.Id;
    TITULO.innerHTML = `${datos.Nombre}`;
    DESCRIPCION.innerHTML = `${datos.Descripcion}`;
    P_ELMNT.innerHTML = `Vence en ${datos.Dias_Restantes} dias y <br/> ${datos.Horas_Restantes} hs.`
    DIV.appendChild(TITULO);
    DIV.appendChild(DESCRIPCION);
    DIV.appendChild(P_ELMNT);
    DIV.onclick = obtenerID;
    let inicial = document.querySelector('.datosMostrados');
    ELEMENTS.insertBefore(DIV, inicial);
}

function obtenerID() {
    Swal.fire({
        title: 'Deseas eliminar la tarea?',
        text: "No podrás revertir los cambios!",
        icon: 'warning',
        background: "var(--color-Fondo)",
        color: "var(--color-Letras)",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminar(this.id);
            ELEMENTS.removeChild(this);
            Swal.fire({
                title: 'Tarea Eliminada',
                background: "var(--color-Fondo)",
                color: "var(--color-Letras)",
            })
        }
    })
}

function eliminar(id) {
    let index = -1;
    for (let este = 0; este < datosGuardados.length; este++) {
        if (datosGuardados[este].Id == id) {
            index = este;
        }
    }
    datosGuardados.splice(index, 1);
    actualizarLocalStorage();
}

function mostrarMensajeListo() {
    Swal.fire({
        icon: 'success',
        title: 'La tarea se agregó correctamente',
        showConfirmButton: false,
        timer: 2000,
        background: "var(--color-Fondo)",
        color: "var(--color-Letras)",
    })
}

function temaClaro() {
    document.documentElement.style.setProperty("--color-Fondo", "#e7e7e7");
    document.documentElement.style.setProperty("--color-Header", "#fff");
    document.documentElement.style.setProperty("--color-Letras", "#333");
    document.documentElement.style.setProperty("--color-Sombras", "#000000");
}

function temaOscuro() {
    document.documentElement.style.setProperty("--color-Fondo", "#121212");
    document.documentElement.style.setProperty("--color-Header", "#333");
    document.documentElement.style.setProperty("--color-Letras", "#fff");
    document.documentElement.style.setProperty("--color-Sombras", "#ffffff");
}

function cambiarTema() {
    tema = !(tema);
    ponerTema();
    guardarTemaEnLS();
}

function ponerTema() {
    if (tema == true) temaClaro();
    else if (tema == false) temaOscuro();
}

function guardarTemaEnLS() {
    localStorage.setItem('Tema', tema);
}

const BUSCADOR = document.getElementById("inputBuscar");
BUSCADOR.addEventListener('input', () => { buscar(BUSCADOR.value) });

function buscar(palabra) {
    if (palabra.length == 0) {
        ELEMENTS.innerHTML = '';
        imprimirTareasEnPantalla();
    }
    else filtrarTareasEnPantalla(filtrarTareas(palabra));
}

function filtrarTareas(nombre) {
    let listaFiltrada = [];
    for (let este = 0; este < datosGuardados.length; este++) {
        if (datosGuardados[este].Nombre.toUpperCase().includes(nombre.toUpperCase())) {
            listaFiltrada.push(datosGuardados[este]);
        }
    }
    return listaFiltrada;
}
function filtrarTareasEnPantalla(tareas) {
    ELEMENTS.innerHTML = '';
    tareas.forEach(elements => {
        mostrarDato(elements);
    });
}

function setearFechaMinima() {
    let fechaInicio = new Date();
    let fechaMinima = `${fechaInicio.getFullYear()}-${fechaInicio.getMonth() + 1}-${'0' + fechaInicio.getDate()}T${fechaInicio.toLocaleTimeString()}`;
    FECHA.value = fechaMinima;
    FECHA.min = fechaMinima;
}