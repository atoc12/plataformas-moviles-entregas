let resultados = []; // Declarar la variable fuera de la función para ser accesible desde otros lugares
function ejecutarCodigo(seleccion) {
    const codigo = seleccion.editor.getValue();
    resultados = []; // Reiniciar el array de resultados antes de cada ejecución
    try {
        eval(codigo);
        mostrarResultados(resultados);
    } catch (error) {
        mostrarError(error);
    }
}

function mostrarResultados(resultados) {
    const consola = document.getElementById('consola');
    consola.innerHTML = resultados.map(resultado => resultado.join('')).join('<br>');
}

function mostrarError(error) {
    const consola = document.getElementById('consola');
    consola.innerHTML = `<span style="color: red;">Error: ${error}</span>`;
}
// Sobrescribir la función console.log para almacenar los resultados
const consoleLogOriginal = console.log;
console.log = function (...args) {
    consoleLogOriginal(...args);
    resultados.push(args.map(arg => argToString(arg)));
};

function argToString(arg) {
    if (typeof arg === 'object' && arg !== null) {
        // Si el argumento es un objeto, mostramos su representación JSON
        return JSON.stringify(arg);
    } else {
        // En otros casos, convertimos el argumento a una cadena de texto
        return String(arg);
    }
}


