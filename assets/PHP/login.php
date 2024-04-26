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

// Verifica si se han enviado datos a través del método POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verifica si se han recibido los datos esperados
    if (isset($_POST['username']) && isset($_POST['password'])) {
        // Recibe los datos del formulario
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Preparar y ejecutar la consulta SQL para verificar el inicio de sesión
        $sql = "SELECT * FROM usuario WHERE nombre = '$username'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // El usuario existe en la base de datos
            // Verificar la contraseña hasheada
            $row = $result->fetch_assoc();
            if (password_verify($password, $row['password'])) {
                // Inicio de sesión exitoso
                // Almacenar el id_user en la sesión
                $_SESSION['user_id'] = $row['id_user'];
                echo "Inicio de sesión exitoso para el usuario: " . $row['nombre'];
            } else {
                echo "Error: Contraseña incorrecta.";
            }
        } else {
            echo "Error: El usuario no existe.";
        }
    } else {
        // Si no se reciben los datos esperados, muestra un mensaje de error
        echo "Error: Se esperaban datos de nombre de usuario y contraseña.";
    }
} else {
    // Si no se envían datos a través de POST, redirecciona a la página de inicio
    header("Location: index.html");
    exit();
}
?>
