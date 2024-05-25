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

// Obtener el ID de usuario de la sesión actual
$id_user = isset($_SESSION['user_id']) ? (int) $_SESSION['user_id'] : 0;

if ($id_user === 0) {
    die("User ID is not set in the session.");
}

// Consulta para obtener los datos de la última sesión del usuario
$sql_sesion = $conn->prepare("SELECT id_sesion, monto_apertura, empleado, nota, fecha_ingreso FROM sesion WHERE id_user = ? ORDER BY fecha_ingreso DESC LIMIT 1");
$sql_sesion->bind_param("i", $id_user);
$sql_sesion->execute();
$result_sesion = $sql_sesion->get_result();

if ($result_sesion->num_rows > 0) {
    $row_sesion = $result_sesion->fetch_assoc();
    $id_sesion = (int) $row_sesion['id_sesion'];
    $monto_apertura = (float) $row_sesion['monto_apertura'];
    $empleado = $row_sesion['empleado'];
    $nota = $row_sesion['nota'];
    $fecha_apertura = $row_sesion['fecha_ingreso'];
} else {
    $id_sesion = 0;
    $monto_apertura = 0;
    $empleado = "No disponible";
    $nota = "No disponible";
    $fecha_apertura = "No disponible";
}

// Consulta para obtener los datos de ventas desde la última sesión del usuario
$sql_ventas = $conn->prepare("SELECT SUM(precio_total) AS monto_total FROM detalle_pedido WHERE id_pedido IN (SELECT id_pedido FROM pedido WHERE id_sesion = ?)");
$sql_ventas->bind_param("i", $id_sesion);
$sql_ventas->execute();
$result_ventas = $sql_ventas->get_result();

if ($result_ventas->num_rows > 0) {
    $row_ventas = $result_ventas->fetch_assoc();
    $monto_ventas = (float) $row_ventas['monto_total'];
} else {
    $monto_ventas = 0; // Si no hay ventas, el monto total de ventas es cero
}

// Calcular el monto total sumando el monto de apertura y el monto de ventas
$monto_total = $monto_apertura + $monto_ventas;

// Consulta para obtener los datos de métodos de pago desde la última sesión del usuario
$sql_metodos_pago = $conn->prepare("
SELECT 
    SUM(CASE WHEN m.nombre_metodo_pago = 'Efectivo' THEN m.monto - COALESCE(p.diferencia, 0) ELSE 0 END) AS efectivo,
    SUM(CASE WHEN m.nombre_metodo_pago = 'Tarjeta' THEN m.monto ELSE 0 END) AS tarjeta,
    SUM(CASE WHEN m.nombre_metodo_pago = 'Transferencia' THEN m.monto ELSE 0 END) AS transferencia
FROM metodo_de_pago AS m
INNER JOIN (
    SELECT 
        id_pedido,
        diferencia
    FROM pedido
    WHERE id_sesion = ?
) AS p ON m.id_pedido = p.id_pedido;
");
$sql_metodos_pago->bind_param("i", $id_sesion);
$sql_metodos_pago->execute();
$result_metodos_pago = $sql_metodos_pago->get_result();

if ($result_metodos_pago->num_rows > 0) {
    $row_metodos_pago = $result_metodos_pago->fetch_assoc();
    $efectivo = (float) $row_metodos_pago['efectivo'];
    $tarjeta = (float) $row_metodos_pago['tarjeta'];
    $transferencia = (float) $row_metodos_pago['transferencia'];
} else {
    $efectivo = 0;
    $tarjeta = 0;
    $transferencia = 0;
}

// Inicializar los montos para cigarros
$cigarros_efectivo = 0;
$cigarros_tarjeta = 0;

// Consulta adicional para obtener detalles de productos de la categoría 'CIGARROS'
$sql_cigarros = $conn->prepare("
SELECT 
    dp.id_detalle_pedido, 
    dp.id_pedido, 
    dp.id_producto, 
    dp.precio_total, 
    p.categoria, 
    -- Selecting only one payment method per order
    (SELECT MIN(nombre_metodo_pago) FROM metodo_de_pago WHERE id_pedido = dp.id_pedido) AS nombre_metodo_pago
FROM detalle_pedido dp
JOIN producto p ON dp.id_producto = p.id_producto
WHERE dp.id_pedido IN (SELECT id_pedido FROM pedido WHERE id_sesion = ?) 
AND p.categoria = 'CIGARROS';

");
$sql_cigarros->bind_param("i", $id_sesion);
$sql_cigarros->execute();
$result_cigarros = $sql_cigarros->get_result();

if ($result_cigarros->num_rows > 0) {
    while ($row_cigarros = $result_cigarros->fetch_assoc()) {
        if ($row_cigarros['nombre_metodo_pago'] == 'Efectivo') {
            $cigarros_efectivo += (float) $row_cigarros['precio_total'];
        } elseif ($row_cigarros['nombre_metodo_pago'] == 'Tarjeta') {
            $cigarros_tarjeta += (float) $row_cigarros['precio_total'];
        }
    }
}

// Mostrar los datos obtenidos en la respuesta
$response = array(
    'empleado' => $empleado,
    'nota' => $nota,
    'fecha_apertura' => $fecha_apertura,
    'monto_apertura' => $monto_apertura,
    'efectivo' => $efectivo,
    'tarjeta' => $tarjeta,
    'transferencia' => $transferencia,
    'cigarros_efectivo' => $cigarros_efectivo,
    'cigarros_tarjeta' => $cigarros_tarjeta,
    'monto_total' => $monto_total
);

$conn->close();

// Imprimir la respuesta JSON
echo json_encode($response);
?>
