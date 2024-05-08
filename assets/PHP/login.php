<?php
session_start(); // Iniciar o reanudar la sesión

// Función para establecer la conexión con la base de datos
function conectarBaseDeDatos() {
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

    return $conn;
}

// Verifica si se han enviado datos a través del método POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Establecer conexión con la base de datos
    $conn = conectarBaseDeDatos();

    // Verifica si se han recibido los datos esperados
    if (isset($_POST['username']) && isset($_POST['password'])) {
        // Recibe los datos del formulario
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Preparar y ejecutar la consulta SQL para verificar el inicio de sesión
        $sql = "SELECT * FROM usuario WHERE nombre = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // El usuario existe en la base de datos
            // Verificar la contraseña hasheada
            $row = $result->fetch_assoc();
            if (password_verify($password, $row['password'])) {
                // Inicio de sesión exitoso
                // Almacenar el id_user en la sesión
                $_SESSION['user_id'] = $row['id_user'];
                $id_user = $row['id_user']; // Almacenar el id_user en la variable global
                echo "Inicio de sesión exitoso para el usuario: " . $row['nombre'];

                // Actualizar validar_sesion a 1 en la tabla usuario
                $sql_update = "UPDATE usuario SET validar_sesion = 1 WHERE id_user = ?";
                $stmt_update = $conn->prepare($sql_update);
                $stmt_update->bind_param("i", $id_user);
                $stmt_update->execute();
                $stmt_update->close();
            } else {
                echo "Error: Contraseña incorrecta.";
            }
        } else {
            echo "Error: El usuario no existe.";
        }
        $stmt->close();
    } else {
        // Si no se reciben los datos esperados, muestra un mensaje de error
        echo "Error: Se esperaban datos de nombre de usuario y contraseña.";
    }
    $conn->close();
} else {
    // Si no se envían datos a través de POST, redirecciona a la página de inicio
    header("Location: index.html");
    exit();
}

// Verificar si la base de datos completa ya está en caché en la sesión
if (!isset($_SESSION['database_cache'])) {
    // La base de datos completa no está en caché, entonces recuperarla de la base de datos
    
    // Establecer conexión con la base de datos
    $conn = conectarBaseDeDatos();

    // Obtener toda la información necesaria de la base de datos y almacenarla en un array asociativo
    $databaseCache = array();

    // Ejemplo: Consulta SQL para obtener todos los productos
    $sqlProductos = "SELECT id_producto, nombre_producto, codigo_de_barras, precio_venta, cantidad, categoria FROM producto WHERE id_user = ?";
    $stmtProductos = $conn->prepare($sqlProductos);
    $stmtProductos->bind_param("s", $_SESSION['user_id']);
    $stmtProductos->execute();
    $resultProductos = $stmtProductos->get_result();

    // Almacenar los productos en el array de caché
    $databaseCache['productos'] = array();
    while ($row = $resultProductos->fetch_assoc()) {
        $databaseCache['productos'][] = $row;
    }

    // Puedes agregar más consultas aquí para obtener otras partes de la base de datos y almacenarlas en $databaseCache

    // Almacenar la base de datos completa en caché en la sesión
    $_SESSION['database_cache'] = $databaseCache;

    // Cerrar la conexión con la base de datos
    $stmtProductos->close();
    // Cierra otras declaraciones preparadas y la conexión con la base de datos si es necesario
    $conn->close();
} else {
    // La base de datos completa está en caché en la sesión, así que simplemente obtenerla de la caché
    $databaseCache = $_SESSION['database_cache'];
}

// Devolver la base de datos como JSON
echo json_encode($databaseCache);
?>
