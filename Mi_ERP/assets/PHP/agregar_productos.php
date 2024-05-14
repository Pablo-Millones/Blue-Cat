<?php
session_start();

// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "erp";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Now you can proceed with your SQL operations

$id_user = $_SESSION['user_id'];

// Verificar si se han recibido los datos esperados
if (isset($_POST['nombre_producto'], $_POST['precio_venta'], $_POST['codigo_de_barras'], $_POST['cantidad'], $_POST['categoria'])) {
    // Recibir los datos del formulario
    $nombre_producto = $_POST['nombre_producto'];
    $precio_venta = $_POST['precio_venta'];
    $codigo_de_barras = $_POST['codigo_de_barras'];
    $cantidad = $_POST['cantidad'];
    $categoria = $_POST['categoria'];
    $id_user = $_SESSION['user_id'];

    // Preparar la consulta SQL para insertar el nuevo producto
    $sql = "INSERT INTO producto (nombre_producto, precio_venta, codigo_de_barras, cantidad, categoria, id_user) VALUES ('$nombre_producto', '$precio_venta', '$codigo_de_barras', '$cantidad', '$categoria', '$id_user')";

    // Ejecutar la consulta SQL y manejar errores si es necesario
    if ($conn->query($sql) === TRUE) {
        // Redireccionar a la página de inventario después de insertar el producto
        header("Location: http://localhost/Mi_ERP/public/inventario.html");
        exit();
    } else {
        echo "Error al agregar el producto: " . $conn->error;
    }
} else {
    // Si no se reciben los datos esperados, mostrar un mensaje de error
    echo "Error: Se esperaban datos de nombre, precio de venta, código de barras, cantidad y categoría.";
}
?>
