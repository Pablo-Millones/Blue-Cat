<?php
session_start(); // Iniciar o reanudar la sesión

$servername = "localhost";
$username = "root";
$password = "";
$database = "erp";

// Establecer conexión con la base de datos
$conn = new mysqli($servername, $username, $password, $database);

// Verificar si hay errores de conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Verificar si se han recibido datos del formulario mediante POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Verificar si hay una sesión iniciada
    if (isset($_SESSION['user_id'])) {
        $id_user = $_SESSION['user_id'];

        // Actualizar el campo validar_sesion en la tabla usuario a 1
        $sql_update = "UPDATE usuario SET validar_sesion = 1 WHERE id_user = ?";
        $stmt_update = $conn->prepare($sql_update);
        $stmt_update->bind_param("i", $id_user);
        $stmt_update->execute();
        $stmt_update->close();

        // Si la actualización fue exitosa, enviar un mensaje de confirmación
        echo "Sesión cerrada correctamente.";
    } else {
        // Si no hay una sesión iniciada, enviar un mensaje de error
        echo "Error: No se encontró una sesión activa.";
    }
} else {
    // Si no se recibieron datos mediante POST, mostrar un mensaje de error
    echo "Error: No se recibieron datos del formulario.";
}

// Cerrar la conexión a la base de datos
$conn->close();
?>