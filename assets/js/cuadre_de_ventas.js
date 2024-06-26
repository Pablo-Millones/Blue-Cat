document.addEventListener("DOMContentLoaded", function() {
    // Obtener la fecha y hora actual
    var fechaHoraActual = new Date();
    var fechaCierre = formatDate(fechaHoraActual);

    // Mostrar la fecha y hora actual en el campo de fecha de cierre
    document.getElementById("fecha_cierre").textContent = fechaCierre;

    // Realizar una solicitud HTTP para obtener los datos del cuadre de ventas
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../assets/PHP/cuadre_de_ventas.php", true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            // Actualizar los campos con los datos recibidos
            document.getElementById("empleado").textContent = data.empleado;
            document.getElementById("nota").textContent = data.nota;
            document.getElementById("fecha_apertura").textContent = data.fecha_apertura;
            document.getElementById("monto_apertura").textContent = data.monto_apertura;
            document.getElementById("efectivo").textContent = data.efectivo;
            document.getElementById("tarjeta").textContent = data.tarjeta;
            document.getElementById("transferencia").textContent = data.transferencia;
            document.getElementById("cigarros_efectivo").textContent = data.cigarros_efectivo;
            document.getElementById("cigarros_tarjeta").textContent = data.cigarros_tarjeta;
            document.getElementById("monto_total").textContent = data.monto_total;
        } else {
            console.error("Error al realizar la solicitud:", xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error("Error de red");
    };
    xhr.send();
});

// Función para formatear la fecha y hora en formato legible
function formatDate(date) {
    var options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString('es-ES', options);
}


document.addEventListener("DOMContentLoaded", function() {
    // Obtener el elemento del input y el elemento del td para el monto total y la diferencia
    var inputDiferencia = document.getElementById("inputDiferencia");
    var tdMontoTotal = document.getElementById("monto_total");
    var tdDiferencia = document.getElementById("diferencia");

    // Agregar un evento de escucha para el evento input al input
    inputDiferencia.addEventListener("input", function() {
        // Obtener el valor introducido en el input
        var valorInput = parseInt(inputDiferencia.value);
        
        // Obtener el valor del monto total mostrado en el td
        var valorMontoTotal = parseInt(tdMontoTotal.textContent);
        
        // Calcular la diferencia (siempre positiva)
        var diferencia = (valorInput - valorMontoTotal);
        
        // Mostrar la diferencia en el td correspondiente
        tdDiferencia.textContent = diferencia;
    });
});

// Función para abrir el popup de cerrar sesión
function openCerrarSesionPopup() {
    document.getElementById("cerrar-sesion-popup").style.display = "block";
}
// Función para cerrar sesión
function cerrarSesion() {
    // Crear un objeto FormData vacío para enviar los datos
    var formData = new FormData();

    // Crear una instancia de XMLHttpRequest
    var xhr = new XMLHttpRequest();

    // Definir la función de retorno de llamada para la solicitud AJAX
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Manejar la respuesta del servidor
                alert(xhr.responseText); // Muestra la respuesta del servidor en una alerta
                // Cierra la ventana actual después de cerrar sesión
                if (xhr.responseText.includes('Sesión cerrada correctamente.')) {
                    window.location.href = 'http://localhost/Mi_ERP/public/punto_de_venta.html'; 
                }
            } else {
                // Manejar errores de la solicitud
                console.error('Error al enviar la solicitud:', xhr.status);
            }
        }
    };

    xhr.open('POST', '../assets/PHP/cerrar_sesion.php', true);

    // Enviar la solicitud AJAX con el objeto FormData vacío
    xhr.send(formData);

    // Prevenir el envío del formulario por defecto
    return false;
}

// Función para cerrar el popup
function CloseSesionPopUp() {
    document.getElementById("cerrar-sesion-popup").style.display = "none";
}