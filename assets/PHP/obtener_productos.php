<?php
session_start(); // Iniciar o reanudar la sesión

// Verificar si el usuario está autenticado
if (!isset($_SESSION['user_id'])) {
    die("Error: Debes iniciar sesión para ver los productos.");
}

// Obtener el id_user de la sesión actual
$id_user = $_SESSION['user_id'];

// Establecer conexión con la base de datos
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

// Inicializar la variable de búsqueda
$searchText = "";

// Verificar si se ha proporcionado un parámetro de búsqueda en la solicitud GET
if (isset($_GET['search'])) {
    // Obtener y sanitizar el valor del parámetro de búsqueda
    $searchText = trim($_GET['search']);
}

// Consulta SQL para obtener los productos asociados al id_user de la sesión actual y que coincidan con el texto de búsqueda
$sql = "SELECT id_producto, nombre_producto, codigo_de_barras, precio_venta, cantidad, categoria FROM producto WHERE id_user = ? AND (nombre_producto LIKE ? OR codigo_de_barras LIKE ?)";
$stmt = $conn->prepare($sql);

// Preparar el valor de búsqueda para que coincida con cualquier parte del nombre del producto o código de barras
$searchPattern = "%$searchText%";
$stmt->bind_param("sss", $id_user, $searchPattern, $searchPattern);
$stmt->execute();
$result = $stmt->get_result();

// Crear un array para almacenar los productos
$productos = array();

// Iterar sobre los resultados y almacenar cada producto en el array
while ($row = $result->fetch_assoc()) {
    $productos[] = $row;
}

// Devolver los productos como JSON
echo json_encode($productos);

// Cerrar la conexión con la base de datos si es necesario
$stmt->close();
$conn->close();
?>
