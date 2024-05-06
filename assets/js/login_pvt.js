// Función para abrir el pop-up
function openPopup() {
    console.log("Abriendo el pop-up...");

    // Realizar una solicitud AJAX para obtener el valor de validar_sesion del servidor
    fetch("../assets/PHP/obtener_validar_sesion.php")
    .then(response => {
        if (!response.ok) {
            throw new Error("La solicitud no fue exitosa: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("Datos recibidos:", data);

        // Verificar el valor de validar_sesion
        if (data && typeof data.validar_sesion !== "undefined") {
            console.log("Valor de validar_sesion:", data.validar_sesion);
            if (data.validar_sesion === 1) {
                // Si validar_sesion es verdadero, mostrar el popup
                console.log("Mostrando el pop-up");
                document.getElementById("popup").style.display = "block";
            } else {
                // Si validar_sesion es falso, no mostrar el popup
                console.log("No se muestra el pop-up");
            }
        } else {
            throw new Error("El formato de los datos recibidos no es válido.");
        }
    })
    .catch(error => {
        console.error("Error al obtener validar_sesion:", error);
    });
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    // Llamar a openPopup después de que el DOM esté listo
    openPopup();
});


  
  // Función para cerrar el pop-up
  function closePopup() {
    document.getElementById("popup").style.display = "none";
  }

  
  function apertura() {
    var monto = document.getElementById('monto').value;
    var empleado = document.getElementById('empleado').value;
    var nota = document.getElementById('nota').value;
  
    // Crear un objeto con los datos de la apertura
    var aperturaData = {
        'monto': monto,
        'empleado': empleado,
        'nota': nota
    };
  
    // Crear una cadena de consulta codificada para enviar los datos
    var formData = new FormData();
    for (var key in aperturaData) {
        formData.append(key, aperturaData[key]);
    }
  
    // Enviar los datos a través de AJAX a formulario_apertura.php
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../assets/PHP/formulario_apertura.php', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // Manejar la respuesta del servidor
                alert(xhr.responseText); // Muestra la respuesta del servidor en una alerta
                // Cierra el popup después de agregar la apertura
                if (xhr.responseText.includes('Apertura realizada exitosamente')) {
                    closePopup(); 
                }
            } else {
                // Manejar errores de la solicitud
                console.error('Error al enviar la solicitud:', xhr.status);
            }
        }
    };
    xhr.send(formData);
    return false; // Esto previene el envío del formulario por defecto
}
