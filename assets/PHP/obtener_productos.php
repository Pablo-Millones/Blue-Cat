<?php
session_start();

// Verificar si el usuario está autenticado
if (!isset($_SESSION['user_id'])) {
    die("Error: Debes iniciar sesión para ver los productos.");
}

// Obtener el id_user de la sesión actual
$id_user = $_SESSION['user_id'];

// Consulta SQL para obtener los productos asociados al id_user de la sesión actual
$sql = "SELECT * FROM producto WHERE id_user = '$id_user'";
// Ejecutar la consulta SQL y manejar los resultados
?>
