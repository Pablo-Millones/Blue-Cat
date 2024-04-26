<?php
$servername = "localhost";
$port = 3306; // Puerto de MySQL, en este caso, 3306
$username = "root";
$password = "";
$database = "erp";

// Establecer conexión con la base de datos
$conn = new mysqli($servername, $username, $password, $database, $port);

// Verificar si hay errores de conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Verifica si se han enviado datos a través del método POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verifica si se han recibido los datos esperados
    if (isset($_POST['new-username']) && isset($_POST['e-mail']) && isset($_POST['confirm-password'])) {
        // Recibe los datos del formulario
        $nombre = $_POST['new-username'];
        $correo = $_POST['e-mail'];
        $password = $_POST['confirm-password'];

        // Hasheamos la contraseña antes de guardarla en la base de datos
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Preparar y ejecutar la consulta SQL para insertar el nuevo usuario
        $sql = "INSERT INTO usuario (nombre, correo, password) VALUES ('$nombre', '$correo', '$hashedPassword')";
        if ($conn->query($sql) === TRUE) {
            echo "Cuenta creada exitosamente para el usuario: $nombre";
        } else {
            echo "Error al crear la cuenta: " . $conn->error;
        }
    } else {
        // Si no se reciben los datos esperados, muestra un mensaje de error
        echo "Error: Se esperaban datos de nombre, correo y contraseña.";
    }
} else {
    // Si no se envían datos a través de POST, redirecciona a la página de inicio
    header("Location: index.html");
    exit();
}

// Cerrar la conexión con la base de datos
$conn->close();
?>
