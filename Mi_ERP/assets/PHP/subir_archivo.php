<?php
session_start(); // Iniciar o reanudar la sesión

$id_user = $_SESSION['user_id'];
// Verificar si se recibió un archivo
if(isset($_FILES["file"])) {
    $file = $_FILES["file"];

    // Verificar si no hay errores en la subida del archivo
    if($file["error"] === UPLOAD_ERR_OK) {
        // Obtener información sobre el archivo
        $fileName = $file["name"];
        $fileTmpName = $file["tmp_name"];

        // Verificar si el archivo es un CSV
        $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        if($fileType === "csv") {
            // Mover el archivo temporal al directorio deseado
            $uploadDir = "../uploads/"; // Directorio donde se almacenarán los archivos subidos
            $uploadPath = $uploadDir . $fileName;
            if(move_uploaded_file($fileTmpName, $uploadPath)) {
                echo "¡El archivo se subió correctamente!<br>";

                // Abrir el archivo CSV
                $fileHandle = fopen($uploadPath, "r");
                if($fileHandle !== false) {
                    // Establecer conexión con la base de datos
                    $servername = "localhost";
                    $username = "root";
                    $password = "";
                    $dbname = "erp";
                    $conn = new mysqli($servername, $username, $password, $dbname);

                    // Verificar la conexión
                    if ($conn->connect_error) {
                        die("Conexión fallida: " . $conn->connect_error);
                    }

                    // Omitir la primera línea (encabezados)
                    fgetcsv($fileHandle);

                    // Contador de filas
                    $row = 1;

                    // Leer el archivo línea por línea
                    while(($data = fgetcsv($fileHandle)) !== false) {
                        // Procesar cada línea de datos e insertar en la base de datos
                        $nombre = $conn->real_escape_string($data[0]);
                        $precio = $conn->real_escape_string($data[1]);
                        $codigoBarras = $conn->real_escape_string($data[2]);
                        $cantidad = $conn->real_escape_string($data[3]);
                        $categoria = isset($data[4]) ? "'" . $conn->real_escape_string($data[4]) . "'" : "NULL";

                        // Query de inserción
                        $sql = "INSERT INTO producto (id_user, nombre_producto, precio_venta, codigo_de_barras, cantidad, categoria) VALUES ('$id_user', '$nombre', '$precio', '$codigoBarras', '$cantidad', $categoria)";

                        // Ejecutar consulta
                        echo "Ejecutando consulta para fila $row: $sql<br>";
                        if ($conn->query($sql) === TRUE) {
                            echo "Registro insertado correctamente para fila $row: $nombre, $precio, $codigoBarras, $cantidad, $categoria<br>";
                        } else {
                            echo "Error al insertar registro para fila $row: " . $conn->error . "<br>";
                        }

                        // Incrementar el contador de filas
                        $row++;
                    }

                    // Cerrar la conexión
                    $conn->close();
                    fclose($fileHandle);
                } else {
                    echo "Error al abrir el archivo CSV.";
                }
            } else {
                echo "Error al subir el archivo.";
            }
        } else {
            echo "El archivo debe ser un CSV.";
        }
    } else {
        echo "Error en la subida del archivo: " . $file["error"];
    }
} else {
    echo "No se recibió ningún archivo.";
}
?>
