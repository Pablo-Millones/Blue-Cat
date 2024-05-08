<?php
// Obtener el número de página de la solicitud
$pageNumber = isset($_GET['page']) ? intval($_GET['page']) : 1;
echo 'page' . $pageNumber;
$itemsPerPage = 10; // Número de productos por página

// Calcular el índice inicial para la paginación
$startIndex = ($pageNumber - 1) * $itemsPerPage;

// Establecer conexión con la base de datos
// ...

// Consulta SQL para obtener los productos con paginación
$sql = "SELECT id_producto, nombre_producto, codigo_de_barras, precio_venta, cantidad, categoria FROM producto WHERE id_user = ? LIMIT ?, ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sii", $id_user, $startIndex, $itemsPerPage);
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
