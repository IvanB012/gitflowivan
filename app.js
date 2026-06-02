let tareas = [];

// Clave para guardar en localStorage
const CLAVE_STORAGE = 'tareas';

// --- REFERENCIAS AL DOM ---
const campoTarea = document.getElementById('campo-tarea');
const btnAgregar = document.getElementById('btn-agregar');
const listaTareas = document.getElementById('lista-tareas');
const contador = document.getElementById('contador');

// ============================================================
//  PERSISTENCIA — localStorage
// ============================================================

/** Guarda el arreglo de tareas en localStorage */
function guardarEnStorage() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(tareas));
}

/** Carga las tareas de localStorage. Si falla, inicia un arreglo vacío */
function cargarDesdeStorage() {
    try {
        const datos = localStorage.getItem(CLAVE_STORAGE);
        if (datos !== null) {
            tareas = JSON.parse(datos);
        }
    } catch (error) {
        console.warn('No se pudo cargar tareas desde localStorage:', error);
        tareas = [];
    }
}

// ============================================================
//  INTERFAZ — Renderizado y contador
// ============================================================

/** Actualiza el contador de tareas totales y pendientes */
function actualizarContador() {
    const total = tareas.length;
    const pendientes = tareas.filter(t => !t.completada).length;
    contador.textContent = `Total: ${total} | Pendientes: ${pendientes}`;
}

/** Limpia y vuelve a pintar la lista de tareas en el DOM */
function renderizarLista() {
    listaTareas.innerHTML = '';

    tareas.forEach(tarea => {
        const li = document.createElement('li');
        li.classList.add(tarea.completada ? 'tarea-completada' : 'tarea-pendiente');

        const span = document.createElement('span');
        span.textContent = tarea.texto;
        span.addEventListener('click', () => toggleCompletar(tarea.id));

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('btn-eliminar');
        btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));

        li.appendChild(span);
        li.appendChild(btnEliminar);
        listaTareas.appendChild(li);
    });

    actualizarContador();
}

// ============================================================
//  LÓGICA PRINCIPAL — Operaciones
// ============================================================

/** Crea y añade una nueva tarea, luego actualiza la UI */
function agregarTarea() {
    const texto = campoTarea.value.trim();
    if (texto === '') return;

    const nuevaTarea = {
        id: Date.now(),
        texto: texto,
        completada: false
    };
    
    tareas.push(nuevaTarea);
    guardarEnStorage();
    campoTarea.value = '';
    renderizarLista();
}

/** Alterna el estado (pendiente/completada) de una tarea */
function toggleCompletar(id) {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;

    tarea.completada = !tarea.completada;
    guardarEnStorage();
    renderizarLista();
}

/** Elimina una tarea por su id */
function eliminarTarea(id) {
    tareas = tareas.filter(t => t.id !== id);
    guardarEnStorage();
    renderizarLista();
}

// ============================================================
//  EVENT LISTENERS E INICIALIZACIÓN
// ============================================================

// Listener para el botón de agregar
btnAgregar.addEventListener('click', agregarTarea);

// Listener para la tecla Enter en el input
campoTarea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') agregarTarea();
});

// Carga inicial de datos y primer renderizado
cargarDesdeStorage();
renderizarLista();

