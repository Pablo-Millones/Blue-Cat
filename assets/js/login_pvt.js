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
  
  // Cuando se envíe el formulario, aquí podrías enviar los datos a tu servidor
  document.getElementById("apertura-form").addEventListener("submit", function(event) {
    event.preventDefault();
    // Aquí puedes enviar los datos del formulario al servidor usando AJAX
    let monto = document.getElementById("monto").value;
    let empleado = document.getElementById("empleado").value;
    let nota = document.getElementById("nota").value;
  
    // Ejemplo de cómo podrías enviar los datos utilizando fetch
    fetch("../assets/PHP/procesar_apertura.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        monto: monto,
        empleado: empleado,
        nota: nota
      })
    })
    .then(response => {
      if (response.ok) {
        // Si la respuesta del servidor es exitosa, puedes cerrar el pop-up
        closePopup();
        // Aquí podrías realizar alguna acción adicional, como recargar la página
        // window.location.reload();
      } else {
        // Si la respuesta del servidor no es exitosa, puedes manejar el error aquí
        console.error("Error al enviar los datos al servidor");
      }
    })
    .catch(error => {
      // Manejar errores de red u otros errores
      console.error("Error de red:", error);
    });
  });
  
// Función para enviar el formulario
function submitForm() {
    var form = document.getElementById("apertura-form");
    var formData = new FormData(form);
  
    fetch("../assets/PHP/formulario_apertura.php", {
      method: "POST",
      body: formData
    })
    .then(response => response.text())
    .then(result => {
      if (result === "success") {
        alert("Formulario enviado exitosamente.");
        closePopup();
      } else {
        alert("Hubo un error al enviar el formulario.");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Hubo un error al enviar el formulario.");
    });
  }
  
  