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
$id_user = $_SESSION['user_id'];

// Consulta para obtener los datos de la última sesión del usuario
$sql_sesion = "SELECT id_sesion, monto_apertura, empleado, nota, fecha_ingreso FROM sesion WHERE id_user = $id_user ORDER BY fecha_ingreso DESC LIMIT 1";
$result_sesion = $conn->query($sql_sesion);

if ($result_sesion->num_rows > 0) {
    $row_sesion = $result_sesion->fetch_assoc();
    $id_sesion = $row_sesion['id_sesion'];
    $monto_apertura = $row_sesion['monto_apertura'];
    $empleado = $row_sesion['empleado'];
    $nota = $row_sesion['nota'];
    $fecha_apertura = $row_sesion['fecha_ingreso'];
} else {
    $id_sesion = 0;
    $monto_apertura = "No disponible";
    $empleado = "No disponible";
    $nota = "No disponible";
    $fecha_apertura = "No disponible";
}

// Consulta para obtener los datos de ventas desde la última sesión del usuario
$sql_ventas = "SELECT SUM(precio_total) AS monto_total FROM detalle_pedido WHERE id_pedido IN (SELECT id_pedido FROM pedido WHERE id_sesion = $id_sesion)";
$result_ventas = $conn->query($sql_ventas);

if ($result_ventas->num_rows > 0) {
    $row_ventas = $result_ventas->fetch_assoc();
    $monto_ventas = $row_ventas['monto_total'];
} else {
    $monto_ventas = 0; // Si no hay ventas, el monto total de ventas es cero
}

// Calcular el monto total sumando el monto de apertura y el monto de ventas
$monto_total = $monto_apertura + $monto_ventas;
// Consulta para obtener los datos de métodos de pago desde la última sesión del usuario
$sql_metodos_pago = "SELECT 
                        SUM(CASE WHEN nombre_metodo_pago = 'Efectivo' THEN monto ELSE 0 END) AS efectivo,
                        SUM(CASE WHEN nombre_metodo_pago = 'Tarjeta' THEN monto ELSE 0 END) AS tarjeta,
                        SUM(CASE WHEN nombre_metodo_pago = 'Transferencia' THEN monto ELSE 0 END) AS transferencia,
                        SUM(CASE WHEN nombre_metodo_pago = 'Cigarros efectivo' THEN monto ELSE 0 END) AS cigarros_efectivo,
                        SUM(CASE WHEN nombre_metodo_pago = 'Cigarros tarjeta' THEN monto ELSE 0 END) AS cigarros_tarjeta
                    FROM metodo_de_pago
                    WHERE id_pedido IN (SELECT id_pedido FROM pedido WHERE id_sesion = $id_sesion)";
$result_metodos_pago = $conn->query($sql_metodos_pago);

if ($result_metodos_pago->num_rows > 0) {
    $row_metodos_pago = $result_metodos_pago->fetch_assoc();
    $efectivo = $row_metodos_pago['efectivo'];
    $tarjeta = $row_metodos_pago['tarjeta'];
    $transferencia = $row_metodos_pago['transferencia'];
    $cigarros_efectivo = $row_metodos_pago['cigarros_efectivo'];
    $cigarros_tarjeta = $row_metodos_pago['cigarros_tarjeta'];
} else {
    $efectivo = 0;
    $tarjeta = 0;
    $transferencia = 0;
    $cigarros_efectivo = 0;
    $cigarros_tarjeta = 0;
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
