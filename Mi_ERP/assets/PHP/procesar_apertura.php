<?php
// Verifica si se ha enviado un POST al script
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verifica si los datos requeridos están presentes en el POST
    if (isset($_POST["monto"]) && isset($_POST["empleado"])) {
        // Captura los datos del POST
        $monto = $_POST["monto"];
        $empleado = $_POST["empleado"];
        // Verifica si se ha enviado una nota, si no, establece un valor predeterminado
        $nota = isset($_POST["nota"]) ? $_POST["nota"] : "";

        // Realiza la conexión a la base de datos
        $servername = "localhost";
        $username = "root";
        $password = "";
        $database = "erp";

        $conn = new mysqli($servername, $username, $password, $database);

        // Verifica si la conexión fue exitosa
        if ($conn->connect_error) {
            die("Error de conexión a la base de datos: " . $conn->connect_error);
        }

        // Prepara la consulta SQL para insertar los datos de apertura de sesión
        $sql = "INSERT INTO sesion (id_user, fecha_ingreso, monto_apertura, empleado, nota) VALUES (?, NOW(), ?, ?, ?)";

        // Prepara la sentencia SQL
        $stmt = $conn->prepare($sql);

        // Verifica si la preparación de la sentencia SQL fue exitosa
        if ($stmt === false) {
            die("Error al preparar la consulta: " . $conn->error);
        }

        // Vincula los parámetros a la sentencia SQL
        $stmt->bind_param("iiss", $id_user, $monto, $empleado, $nota);

        // Aquí deberías establecer el id del usuario autenticado
        // Puedes obtenerlo desde tu sistema de autenticación o desde la sesión, por ejemplo
        $id_user = 1; // Esto es solo un ejemplo, deberías establecer el id del usuario autenticado correctamente

        // Ejecuta la sentencia SQL
        if ($stmt->execute()) {
            // Si la ejecución de la consulta fue exitosa, muestra un mensaje de éxito
            echo "Apertura de sesión realizada con éxito";
        } else {
            // Si hubo un error al ejecutar la consulta, muestra un mensaje de error
            echo "Error al abrir la sesión: " . $stmt->error;
        }

        // Cierra la conexión y libera los recursos
        $stmt->close();
        $conn->close();
    } else {
        // Si no se proporcionaron los datos requeridos en el POST, muestra un mensaje de error
        echo "Error: Se requieren el monto y el empleado para abrir la sesión";
    }
} else {
    // Si la solicitud no es un POST, muestra un mensaje de error
    echo "Error: Método de solicitud no permitido";
}
?>
