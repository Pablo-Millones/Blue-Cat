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

// Verificar si se ha iniciado sesión y si existe el id_user en la sesión
if (isset($_SESSION['user_id'])) {
    // Obtener el id_user de la sesión
    $id_user = $_SESSION['user_id'];
    
    // Preparar y ejecutar la consulta SQL para obtener el valor de validar_sesion
    $sql = "SELECT validar_sesion FROM usuario WHERE id_user = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        die("Error al preparar la consulta: " . $conn->error);
    }

    // Vincular el parámetro a la sentencia SQL
    $stmt->bind_param("i", $id_user);

    // Ejecutar la consulta
    if ($stmt->execute()) {
        // Obtener el resultado de la consulta
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        // Enviar el resultado como JSON
        echo json_encode($row);
    } else {
        // Si hay un error al ejecutar la consulta, enviar un mensaje de error
        echo json_encode(array("error" => "Error al ejecutar la consulta"));
    }

    // Cerrar la sentencia y la conexión
    $stmt->close();
    $conn->close();
} else {
    // Si no se ha iniciado sesión, enviar un mensaje de error
    echo json_encode(array("error" => "No se ha iniciado sesión"));
}
?>
