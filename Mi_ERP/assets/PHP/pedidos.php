<?php
// Datos de conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$database = "erp";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verificar la conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Obtener los datos de la solicitud POST
$requestBody = json_decode(file_get_contents("php://input"), true);

// Obtener los datos de venta, paymentRecords y cartItemsArray
$saleData = json_decode($requestBody['saleData'], true);
$paymentRecords = json_decode($requestBody['paymentRecords'], true);
$cartItemsArray = json_decode($requestBody['cartItemsArray'], true);

// Debug: Ver el array de paymentRecords
echo "Debug: paymentRecords antes de la inserción:<br>";
print_r($paymentRecords);
print_r($cartItemsArray);
echo "<br><br>";

// Obtener la fecha actual
$date = date("Y-m-d");

// Consultar el valor más alto del campo id_sesion en la tabla sesion
$sql_max_id = "SELECT MAX(id_sesion) AS max_id FROM sesion";

$result = $conn->query($sql_max_id);

if ($result->num_rows > 0) {
    // Obtener el resultado de la consulta
    $row = $result->fetch_assoc();
    $max_id_sesion = $row["max_id"];
    echo "ID de sesión máximo: " . $max_id_sesion . "<br>";
} else {
    // Si no hay resultados, asignar un valor predeterminado
    $max_id_sesion = 1; // O cualquier valor predeterminado que desees
    echo "No se encontraron sesiones. Se asigna el valor predeterminado: " . $max_id_sesion . "<br>";
}

// Insertar los datos en la tabla de pedidos
$sql_insert_pedido = "INSERT INTO pedido (id_sesion, precio_total, pago_total, diferencia, fecha)
                      VALUES (?, ?, ?, ?, ?)";

// Preparar la declaración
$stmt = $conn->prepare($sql_insert_pedido);

// Vincular parámetros
$stmt->bind_param("iddds", $max_id_sesion, $totalPrice, $totalPayment, $change, $date);

// Obtener los datos de la venta
$totalPrice = $saleData['totalPrice'];
$totalPayment = $saleData['totalPayment'];
$change = $saleData['change'];

// Ejecutar la declaración
if ($stmt->execute()) {
    echo "Pedido insertado correctamente.<br>";

    // Obtener el ID del pedido recién insertado
    $last_insert_id = $conn->insert_id;

    // Iterar sobre los elementos del carrito y los registros de métodos de pago simultáneamente
    foreach ($cartItemsArray as $item) {
        $id_producto = $item['id_producto'];
        $cantidad_pedida = $item['quantity'];
        $precio_total = $item['price'];

        // Obtener la cantidad actual del producto desde la base de datos
        $sql_get_current_quantity = "SELECT cantidad FROM producto WHERE id_producto = ?";
        $stmt_current_quantity = $conn->prepare($sql_get_current_quantity);
        $stmt_current_quantity->bind_param("i", $id_producto);
        $stmt_current_quantity->execute();
        $stmt_current_quantity->store_result();
        $stmt_current_quantity->bind_result($current_quantity);
        $stmt_current_quantity->fetch();
        $stmt_current_quantity->close();

        // Calcular la nueva cantidad
        $new_quantity = $current_quantity - $cantidad_pedida;

        // Actualizar la cantidad en la tabla de productos
        $sql_update_quantity = "UPDATE producto SET cantidad = ? WHERE id_producto = ?";
        $stmt_update_quantity = $conn->prepare($sql_update_quantity);
        $stmt_update_quantity->bind_param("ii", $new_quantity, $id_producto);
        $stmt_update_quantity->execute();
        $stmt_update_quantity->close();

        // Insertar los detalles del pedido en la tabla detalle_pedido
        $sql_insert_detalle_pedido = "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad_pedida, precio_total)
                                      VALUES (?, ?, ?, ?)";

        // Preparar la declaración
        $stmt_detalle = $conn->prepare($sql_insert_detalle_pedido);

        // Vincular parámetros
        $stmt_detalle->bind_param("iiid", $last_insert_id, $id_producto, $cantidad_pedida, $precio_total);

        // Ejecutar la declaración
        if ($stmt_detalle->execute()) {
            echo "Detalle del pedido insertado correctamente para el producto con ID: $id_producto<br>";
        } else {
            echo "Error al insertar detalle del pedido: " . $stmt_detalle->error;
        }

        // Cerrar la declaración
        $stmt_detalle->close();
    }

    // Insertar los registros de métodos de pago en la tabla metodo_de_pago si hay datos disponibles
    if ($paymentRecords !== null) {
        foreach ($paymentRecords as $record) {
            $nombre_metodo_pago = $record['name'];
            $monto = $record['value'];

            // Insertar registros de métodos de pago en la tabla metodo_de_pago
            $sql_insert_metodo_de_pago = "INSERT INTO metodo_de_pago (id_pedido, nombre_metodo_pago, monto)
                                          VALUES (?, ?, ?)";

            // Preparar la declaración
            $stmt_metodo = $conn->prepare($sql_insert_metodo_de_pago);

            // Vincular parámetros
            $stmt_metodo->bind_param("isd", $last_insert_id, $nombre_metodo_pago, $monto);

            // Ejecutar la declaración
            if ($stmt_metodo->execute()) {
                echo "Registro de método de pago insertado correctamente: $nombre_metodo_pago<br>";
            } else {
                echo "Error al insertar registro de método de pago: " . $stmt_metodo->error;
            }

            // Cerrar la declaración
            $stmt_metodo->close();
        }
    } else {
        echo "No hay registros de métodos de pago disponibles.";
    }
} else {
    echo "Error al insertar pedido: " . $stmt->error;
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>
