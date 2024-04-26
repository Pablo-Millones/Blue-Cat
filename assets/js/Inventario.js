function openPopup() {
    document.getElementById("create-product-popup").style.display = "block";
}

function closePopup() {
    document.getElementById("create-product-popup").style.display = "none";
}

function agregarProducto() {
    // Obtener los valores del formulario de agregar producto
    var nombre = document.getElementById('nombre_producto').value;
    var precioVenta = document.getElementById('precio_venta').value;
    var codigoBarras = document.getElementById('codigo_de_barras').value;
    var cantidad = document.getElementById('cantidad').value;
    var categoria = document.getElementById('categoria').value;

    // Crear un objeto con los datos del producto
    var productoData = {
        'nombre_producto': nombre,
        'precio_venta': precioVenta,
        'codigo_de_barras': codigoBarras,
        'cantidad': cantidad,
        'categoria': categoria
    };

    // Crear una cadena de consulta codificada para enviar los datos
    var formData = new URLSearchParams();
    for (var key in productoData) {
        formData.append(key, productoData[key]);
    }

    // Enviar los datos a través de AJAX a agregar_productos.php
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../assets/PHP/agregar_productos.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Manejar la respuesta del servidor
            alert(xhr.responseText); // Muestra la respuesta del servidor en una alerta
            // Actualizar la lista de productos si el producto se agregó correctamente
            if (xhr.responseText.includes('Producto agregado exitosamente')) {
                mostrarProductos(); // Llama a la función para mostrar los productos actualizados
                closePopup(); // Cierra el popup después de agregar el producto
            }
        }
    };
    xhr.send(formData);
}

function mostrarProductos() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var productos = JSON.parse(xhr.responseText);
            var tbody = document.querySelector("#product-table tbody");
            tbody.innerHTML = "";

            productos.forEach(function(producto) {
                var tr = document.createElement("tr");
                tr.innerHTML = "<td>" + producto.nombre_producto + "</td>" +
                               "<td>" + producto.codigo_de_barras + "</td>" +
                               "<td>" + producto.precio_venta + "</td>" +
                               "<td>" + producto.cantidad + "</td>";
                tbody.appendChild(tr);
            });
        }
    };
    xhr.open("GET", "../assets/PHP/obtener_productos.php", true);
    xhr.send();
}

window.onload = function() {
    mostrarProductos();
};
