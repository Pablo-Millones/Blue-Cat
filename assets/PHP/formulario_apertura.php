<?php
session_start();

function procesarFormulario() {
    // Verificar si se recibió un POST
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Verificar si se enviaron los datos esperados
        if (isset($_POST['monto']) && isset($_POST['empleado']) && isset($_POST['nota'])) {
            // Recibir los datos del formulario
            $montoApertura = $_POST['monto'];
            $empleado = $_POST['empleado'];
            $nota = $_POST['nota'];

            // Verificar si el id del usuario está en la sesión
            if(isset($_SESSION['id_user'])) {
                $id_user = $_SESSION['id_user'];

                // Realizar la inserción en la base de datos
                $conexion = new mysqli("localhost", "root", "", "erp");

                if ($conexion->connect_error) {
                    die("La conexión falló: " . $conexion->connect_error);
                }

                // Preparar la consulta
                $stmt = $conexion->prepare("INSERT INTO abrir_sesion (id_user, fecha_ingreso, monto_apertura, empleado, nota) VALUES (?, NOW(), ?, ?, ?)");

                // Vincular los parámetros
                $stmt->bind_param("idss", $id_user, $montoApertura, $empleado, $nota);

                // Ejecutar la consulta
                if ($stmt->execute()) {
                    echo "success";
                } else {
                    echo "error";
                }

                // Cerrar la conexión y la declaración
                $stmt->close();
                $conexion->close();
            } else {
                echo "No se ha iniciado sesión correctamente.";
            }
        } else {
            echo "No se recibieron todos los datos esperados.";
        }
    } else {
        echo "La solicitud no es de tipo POST.";
    }
}

// Llamar a la función para procesar el formulario
procesarFormulario();
?>
