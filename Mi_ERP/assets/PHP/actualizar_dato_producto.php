<?php
// Verificar si se reciben los datos esperados
if (isset($_POST['columnIndex'], $_POST['newValue'], $_POST['productId'])) {
    // Conectar a la base de datos (ajusta estos valores según tu configuración)
    $servername = "localhost";
    $username = "root";
    $password = "";
    $database = "erp";

    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $database);

    // Verificar la conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Obtener los datos enviados por el cliente
    $newValue = $_POST['newValue']; // Nuevo valor
    $columnIndex = $_POST['columnIndex']; // Índice de la columna
    $productId = $_POST['productId']; // ID del producto

    // Definir los nombres de las columnas en la tabla (ajusta estos valores según tu esquema de base de datos)
    $columnNames = array('id_producto','nombre_producto', 'codigo_de_barras', 'precio_venta', 'cantidad', 'categoria');

    // Verificar si el índice de la columna es válido
    if ($columnIndex >= 0 && $columnIndex < count($columnNames)) {
        // Escapar los datos para evitar inyección de SQL
        $newValue = $conn->real_escape_string($newValue);
        $column = $columnNames[$columnIndex];

        // Si el nuevo valor es vacío, establecerlo como NULL
        if ($newValue === '') {
            $newValue = 'NULL';
        } else {
            $newValue = "'$newValue'";
        }
        
        // Preparar y ejecutar la consulta de actualización
        $sql = "UPDATE producto SET $column = $newValue WHERE id_producto = $productId";

        if ($conn->query($sql) === TRUE) {
            echo "¡Datos actualizados correctamente!";
        } else {
            echo "Error al actualizar los datos: " . $conn->error;
        }
    } else {
        echo "Índice de columna no válido.";
    }

    // Cerrar la conexión
    $conn->close();
} else {
    echo "Datos insuficientes recibidos.";
}
?>
