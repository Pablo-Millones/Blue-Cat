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
    // Recoger los datos del formulario
    $monto = $_POST['monto'];
    $empleado = $_POST['empleado'];
    $nota = $_POST['nota'];

    // Aquí podrías realizar operaciones adicionales, como guardar los datos en una base de datos

    // Simplemente imprimir un mensaje de éxito como respuesta
    echo "Apertura realizada exitosamente. Monto: $monto, Empleado: $empleado, Nota: $nota";

    // Verificar si hay una sesión iniciada
    if (isset($_SESSION['user_id'])) {
        $id_user = $_SESSION['user_id'];

        // Insertar los datos de apertura de sesión en la tabla sesion
        $fecha_ingreso = date("Y-m-d H:i:s"); // Obtener la fecha y hora actual
        $sql_insert = "INSERT INTO sesion (id_user, fecha_ingreso, monto_apertura, empleado, nota) VALUES (?, ?, ?, ?, ?)";
        $stmt_insert = $conn->prepare($sql_insert);
        $stmt_insert->bind_param("issss", $id_user, $fecha_ingreso, $monto, $empleado, $nota);
        $stmt_insert->execute();
        $stmt_insert->close();

        // Actualizar el campo validar_sesion en la tabla usuario a 2
        $sql_update = "UPDATE usuario SET validar_sesion = 2 WHERE id_user = ?";
        $stmt_update = $conn->prepare($sql_update);
        $stmt_update->bind_param("i", $id_user);
        $stmt_update->execute();
        $stmt_update->close();
    }
} else {
    // Si no se recibieron datos mediante POST, mostrar un mensaje de error
    echo "Error: No se recibieron datos del formulario.";
}

$conn->close();
?>