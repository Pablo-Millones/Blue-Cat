function loadProducts() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../assets/PHP/obtener_productos_punto_venta.php', true); // Reemplaza el archivo PHP por el que obtiene productos por usuario
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var productos = JSON.parse(xhr.responseText);
            var productGrid = document.getElementById('product-grid');
            productGrid.innerHTML = ''; // Limpiamos el contenido previo del contenedor
            productos.forEach(function(producto) {
                var productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = '<h3>' + producto.nombre_producto + '</h3>' +
                                       '<p>Precio: ' + producto.precio_venta + '</p>'; // Puedes agregar más detalles si lo necesitas
                productGrid.appendChild(productDiv);
            });
        }
    };
    xhr.send();
  }
  