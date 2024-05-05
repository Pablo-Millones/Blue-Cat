<?php
// Verificar si se recibieron los datos del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $postData = file_get_contents('php://input');

    // Mostrar los datos recibidos
    echo "Datos recibidos: ";
    var_dump($saleData);

    // Verificar si se recibieron los datos correctamente
    if ($saleData !== null) {
        $servername = "localhost";
        $username = "root";
        $password = "";
        $database = "erp";
        

        $conn = new mysqli($servername, $username, $password, $dbname);

        // Verificar la conexión
        if ($conn->connect_error) {
            die("Error de conexión: " . $conn->connect_error);
        }

        // Preparar la consulta para insertar los datos en la tabla de pedidos
        $stmt = $conn->prepare("INSERT INTO pedidos (id_user, precio_total, pago_total, diferencia, fecha) VALUES (?, ?, ?, ?, NOW())");
        
        // Verificar si la preparación de la consulta fue exitosa
        if ($stmt === false) {
            die("Error de preparación de la consulta: " . $conn->error);
        }

        // Vincular los parámetros a la consulta
        $stmt->bind_param("iiii", $idUser, $totalPrice, $totalPayment, $change);

        // Asignar los valores a los parámetros
        $idUser = $_SESSION["id_usuario"]; // Aquí debes usar el ID de usuario adecuado
        $totalPrice = $saleData["totalPrice"];
        $totalPayment = $saleData["totalPayment"];
        $change = $saleData["change"];

        // Ejecutar la consulta
        if ($stmt->execute() === true) {
            // Obtener el ID del pedido insertado
            $lastId = $conn->insert_id;
            
            // Ahora inserta los detalles del producto del pedido en la tabla de detalles del pedido
            foreach ($saleData["products"] as $product) {
                // Preparar la consulta para insertar los detalles del producto
                $stmtDetails = $conn->prepare("INSERT INTO detalles_pedido (id_pedido, nombre_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)");
                
                // Verificar si la preparación de la consulta fue exitosa
                if ($stmtDetails === false) {
                    die("Error de preparación de la consulta: " . $conn->error);
                }

                // Vincular los parámetros a la consulta
                $stmtDetails->bind_param("isid", $lastId, $productName, $quantity, $price);

                // Asignar los valores a los parámetros
                $productName = $product["name"];
                $quantity = $product["quantity"];
                $price = $product["price"];

                // Ejecutar la consulta
                if ($stmtDetails->execute() === false) {
                    die("Error al insertar detalles del producto: " . $conn->error);
                }
            }
            echo "Venta registrada correctamente con el ID: " . $lastId;
        } else {
            echo "Error al insertar el pedido: " . $conn->error;
        }

        // Cerrar la conexión
        $conn->close();
    } else {
        // Si los datos no se recibieron correctamente, mostrar un mensaje de error
        echo "Error al recibir los datos de la venta.";
    }
} else {
    // Si la solicitud no es de tipo POST, mostrar un mensaje de error
    echo "Acceso no permitido.";
}
?>
