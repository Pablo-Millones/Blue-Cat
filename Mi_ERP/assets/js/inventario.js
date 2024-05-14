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
  
  function actualizarDatoEnServidor(columnIndex, newValue, productId) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../assets/PHP/actualizar_dato_producto.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Aquí puedes manejar la respuesta del servidor si es necesario
            console.log(xhr.responseText); // Por ejemplo, puedes imprimir la respuesta en la consola del navegador
        }
    };
    var formData = new URLSearchParams();
    formData.append('columnIndex', columnIndex);
    formData.append('newValue', newValue);
    formData.append('productId', productId); // Se envía el id_producto
    xhr.send(formData);
}

 function mostrarProductos() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../assets/PHP/obtener_productos.php', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var productos = JSON.parse(xhr.responseText);
            var tbody = document.querySelector('#product-table tbody');
            tbody.innerHTML = '';
            productos.forEach(function(producto) {
                var tr = document.createElement('tr');
                tr.innerHTML = '<td>' + producto.id_producto + '</td>' +
                               '<td contenteditable="true">' + producto.nombre_producto + '</td>' +
                               '<td contenteditable="true">' + producto.codigo_de_barras + '</td>' +
                               '<td contenteditable="true">' + producto.precio_venta + '</td>' +
                               '<td contenteditable="true">' + producto.cantidad + '</td>'+
                               '<td contenteditable="true">' + producto.categoria + '</td>';

                
                // Agregar eventos para cambiar estilos al pasar el mouse sobre cada td
                tr.querySelectorAll('td').forEach(function(td) {
                    td.addEventListener('mouseover', function() {
                        // Restaurar el fondo blanco de todos los td
                        tr.querySelectorAll('td').forEach(function(td) {
                            td.style.backgroundColor = '';
                        });
                        // Cambiar el fondo del td actual
                        this.style.backgroundColor = '#385f9e';
                    });
                    td.addEventListener('mouseout', function() {
                        // Restaurar el fondo blanco del td al retirar el mouse
                        this.style.backgroundColor = '';
                    });
                    td.addEventListener('blur', function() {
                        // Obtener el índice de la columna para identificar el campo de la base de datos
                        var columnIndex = Array.from(tr.children).indexOf(td);
                        // Obtener el valor actualizado del td
                        var newValue = td.textContent.trim();
                        // Obtener el id_producto del producto
                        var productId = producto.id_producto;
                        // Enviar los datos actualizados al servidor
                        actualizarDatoEnServidor(columnIndex, newValue, productId);
                    });
                });
                
                tbody.appendChild(tr);
            });
        }
    };
    xhr.send();
}
// Llama a la función cuando la página se carga
document.addEventListener('DOMContentLoaded', mostrarProductos);


// Obtener referencia al campo de entrada de búsqueda
const searchInput = document.getElementById('search-input');

// Obtener referencia a la tabla de productos
const productTable = document.getElementById('product-table');


// Función para realizar la búsqueda y filtrar los productos
function searchProducts() {
  // Obtener el texto de búsqueda
  const searchText = searchInput.value.trim();

  // Verificar si el texto de búsqueda no está vacío
  if (searchText !== "") {
    // Inicializar la solicitud XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../assets/PHP/obtener_productos.php?search=' + encodeURIComponent(searchText), true);

    // Manejar la respuesta de la solicitud
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        // La solicitud fue exitosa, parsear la respuesta JSON
        const resultados = JSON.parse(xhr.responseText);
        // Llamar a la función para mostrar los resultados
        mostrarResultadosBusqueda(resultados);
      } else {
        // La solicitud no fue exitosa, puedes manejar el error aquí si es necesario
        console.error("Error en la solicitud HTTP");
      }
    };

    // Manejar errores de red u otros errores
    xhr.onerror = function() {
      console.error("Error de red o en la solicitud HTTP");
    };

    // Enviar la solicitud
    xhr.send();
  }
}

function mostrarResultadosBusqueda(resultados) {
  // Referencia al cuerpo de la tabla donde se mostrarán los resultados
  const tbody = document.querySelector('#product-table tbody');
  
  // Limpiar la tabla antes de agregar nuevos resultados
  tbody.innerHTML = '';

  // Verificar si hay resultados
  if (resultados.length > 0) {
      // Mostrar cada resultado en la tabla
      resultados.forEach(function(resultado) {
          var tr = document.createElement('tr');
          tr.innerHTML = '<td>' + resultado.id_producto + '</td>' +
                          '<td contenteditable="true">' + resultado.nombre_producto + '</td>' +
                          '<td contenteditable="true">' + resultado.codigo_de_barras + '</td>' +
                          '<td contenteditable="true">' + resultado.precio_venta + '</td>' +
                          '<td contenteditable="true">' + resultado.cantidad + '</td>'+
                          '<td contenteditable="true">' + resultado.categoria + '</td>';

          // Agregar eventos para cambiar estilos al pasar el mouse sobre cada td
          tr.querySelectorAll('td').forEach(function(td) {
              td.addEventListener('mouseover', function() {
                  // Restaurar el fondo blanco de todos los td
                  tr.querySelectorAll('td').forEach(function(td) {
                      td.style.backgroundColor = '';
                  });
                  // Cambiar el fondo del td actual
                  this.style.backgroundColor = '#385f9e';
              });
              td.addEventListener('mouseout', function() {
                  // Restaurar el fondo blanco del td al retirar el mouse
                  this.style.backgroundColor = '';
              });
              td.addEventListener('blur', function() {
                  // Obtener el índice de la columna para identificar el campo de la base de datos
                  var columnIndex = Array.from(tr.children).indexOf(td);
                  // Obtener el valor actualizado del td
                  var newValue = td.textContent.trim();
                  // Obtener el id_producto del producto
                  var productId = resultado.id_producto; // Usamos resultado en lugar de producto
                  // Enviar los datos actualizados al servidor
                  actualizarDatoEnServidor(columnIndex, newValue, productId);
              });
          });

          tbody.appendChild(tr);
      });
  } else {
      // Si no hay resultados, mostrar un mensaje en la tabla
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="6">No se encontraron resultados.</td>';
      tbody.appendChild(tr);
  }
}

// Agregar un evento de escucha para el evento de pulsación de tecla en el campo de búsqueda
searchInput.addEventListener('keydown', function(event) {
  // Verificar si la tecla presionada es "Enter" (código de tecla 13)
  if (event.keyCode === 13) {
    // Llamar a la función searchProducts cuando se presiona "Enter"
    searchProducts();
  }
});


// Función para abrir el popup de importar productos
function openImportPopup() {
    document.getElementById("import-popup").style.display = "block";
  }
  
  // Función para cerrar el popup de importar productos
  function closeImportPopup() {
    document.getElementById("import-popup").style.display = "none";
  }
  
// Función para subir el archivo
function uploadFile() {
    var fileInput = document.getElementById("file-input");
    var file = fileInput.files[0];
    if (file) {
      console.log("Archivo seleccionado:", file.name);
      
      // Crear un objeto FormData para enviar el archivo
      var formData = new FormData();
      formData.append("file", file);
      
      // Crear una solicitud XMLHttpRequest
      var xhr = new XMLHttpRequest();
      
      // Configurar la solicitud
      xhr.open("POST", "../assets/PHP/subir_archivo.php", true);
      
      // Manejar el evento onload (cuando la solicitud se completa)
      xhr.onload = function() {
        if (xhr.status === 200) {
          console.log("El archivo se ha subido correctamente.");
          // Aquí puedes agregar cualquier otra lógica necesaria después de subir el archivo
        } else {
          console.error("Error al subir el archivo:", xhr.statusText);
        }
      };
      
      // Enviar la solicitud con el objeto FormData que contiene el archivo
      xhr.send(formData);
    } else {
      console.log("Ningún archivo seleccionado");
    }
  }
  