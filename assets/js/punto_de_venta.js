function loadProducts() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../assets/PHP/obtener_productos_punto_venta.php', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var productos = JSON.parse(xhr.responseText);
            var productGrid = document.getElementById('product-grid');
            productGrid.innerHTML = ''; // Limpiamos el contenido previo del contenedor

            productos.forEach(function(producto) {
                // Crear el contenedor del producto
                var productDiv = document.createElement('div');
                productDiv.classList.add('product');
                

                // Agregar el nombre del producto como un elemento clicable
                var productName = document.createElement('h3');
                productName.textContent = producto.nombre_producto;
                productName.addEventListener('click', function() {
                    addToCart(producto.nombre_producto, parseFloat(producto.precio_venta));
                });

                // Agregar el precio del producto como un elemento clicable
                var productPrice = document.createElement('p');
                productPrice.textContent = '$' + parseFloat(producto.precio_venta).toFixed(2); // Convertir el precio a número y limitar a dos decimales
                productPrice.addEventListener('click', function() {
                    addToCart(producto.nombre_producto, parseFloat(producto.precio_venta));
                });

                // Agregar el código de barras del producto como un elemento clicable
                var productBarcode = document.createElement('p');
                productBarcode.textContent = producto.codigo_de_barras;
                productBarcode.addEventListener('click', function() {
                    addToCart(producto.nombre_producto, parseFloat(producto.precio_venta));
                });

                // Agregar los elementos al contenedor del producto
                productDiv.appendChild(productName);
                productDiv.appendChild(productPrice);
                productDiv.appendChild(productBarcode);

                // Agregar el contenedor del producto a la grid
                productGrid.appendChild(productDiv);
            });
        }
    };
    xhr.send();
}





// Obtener referencia al campo de entrada de búsqueda
const searchInput = document.getElementById('search-input');

// Obtener referencia a la tabla de productos y a todas las filas de productos
const productGrid = document.getElementById('product-grid');

// Función para realizar la búsqueda y filtrar los productos
function searchProducts() {
  // Convertir el texto de búsqueda a minúsculas para que la búsqueda no sea sensible a mayúsculas y minúsculas
  const searchText = searchInput.value.toLowerCase();

  // Obtener todos los elementos con la clase 'product'
  const products = document.getElementsByClassName('product');

  // Iterar sobre los elementos de producto y mostrar u ocultar según coincida con el texto de búsqueda
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    // Obtener el texto dentro del div de producto
    const productName = product.getElementsByTagName('h3')[0].innerText.toLowerCase();
    const productBarcode = product.getElementsByTagName('p')[1].innerText.toLowerCase(); // Suponiendo que el código de barras es el segundo párrafo
    // Realizar la búsqueda
    if (productName.includes(searchText) || productBarcode.includes(searchText)) {
      // Si hay coincidencia, mostrar el producto
      product.style.display = '';
    } else {
      // Si no hay coincidencia, ocultar el producto
      product.style.display = 'none';
    }
  }
}

// Agregar un evento de escucha para el evento de entrada en el campo de búsqueda
searchInput.addEventListener('input', searchProducts);

// Llamar a loadProducts para cargar los productos inicialmente
loadProducts();

// Función para agregar productos al carrito
function addToCart(productName, productPrice) {
    // Crear un nuevo elemento de lista para el producto
    var cartItem = document.createElement('li');
    cartItem.innerText = productName + ' .................................   $' + productPrice;
    
    // Agregar el elemento de lista al carrito
    var cart = document.getElementById('cart-items');
    cart.appendChild(cartItem);
    
    // Calcular y mostrar el nuevo precio total
    calculateTotalPrice();
}

// Función para quitar productos del carrito
function removeFromCart() {
    // Obtener referencia al carrito de compras
    var cart = document.getElementById('cart-items');
    
    // Obtener el último elemento del carrito
    var lastCartItem = cart.lastElementChild;
    
    // Verificar si hay elementos en el carrito
    if (lastCartItem) {
        // Quitar el último elemento del carrito
        cart.removeChild(lastCartItem);
        // Calcular y mostrar el nuevo precio total
        calculateTotalPrice();
    }
}


// Agregar un evento de escucha para la tecla "borrar" (Backspace)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Backspace') {
        removeFromCart();
    }
});
// Función para calcular el precio total de los productos en el carrito
function calculateTotalPrice() {
    // Obtener referencia al carrito de compras
    var cart = document.getElementById('cart-items');
    
    // Obtener todos los elementos de lista dentro del carrito
    var cartItems = cart.getElementsByTagName('li');
    
    // Variable para almacenar el precio total
    var totalPrice = 0;
    
    // Iterar sobre los elementos del carrito y sumar los precios
    for (var i = 0; i < cartItems.length; i++) {
        // Obtener el texto del elemento de lista
        var itemText = cartItems[i].innerText;
        // Extraer el precio del texto (se asume que el precio está al final del texto y precedido por '$')
        var price = parseFloat(itemText.split('$')[1]);
        // Sumar el precio al total
        totalPrice += price;
    }
    
    // Mostrar el precio total en el elemento HTML correspondiente
    var totalPriceElement = document.querySelector('#precio-total .total');
    totalPriceElement.textContent = 'Total: $' + totalPrice.toFixed(2);
}
// Función para establecer el monto de pago
function setPaymentAmount(amount) {
    // Obtener el elemento de pago
    var paymentElement = document.querySelector('#pago .pago');
    
    // Mostrar el monto de pago en el elemento
    paymentElement.textContent = 'Pago: $' + amount.toFixed(2);
}

// Función para obtener el precio total de los productos en el carrito
function getTotalPrice() {
    // Obtener referencia al carrito de compras
    var cart = document.getElementById('cart-items');
    
    // Obtener todos los elementos de lista dentro del carrito
    var cartItems = cart.getElementsByTagName('li');
    
    // Variable para almacenar el precio total
    var totalPrice = 0;
    
    // Iterar sobre los elementos del carrito y sumar los precios
    for (var i = 0; i < cartItems.length; i++) {
        // Obtener el texto del elemento de lista
        var itemText = cartItems[i].innerText;
        // Extraer el precio del texto (se asume que el precio está al final del texto y precedido por '$')
        var price = parseFloat(itemText.split('$')[1]);
        // Sumar el precio al total
        totalPrice += price;
    }
    
    return totalPrice;
}

// Función para calcular el cambio
function calculateChange(paymentAmount, totalPrice) {
    // Calcular la diferencia entre el pago y el total
    var change = paymentAmount - totalPrice;

    // Obtener el elemento de cambio
    var changeElement = document.querySelector('#cambio .cambio');

    // Mostrar el cambio en el elemento
    changeElement.textContent = 'Cambio: $' + change.toFixed(2);
}

// Obtener referencia al contenedor de productos
const product_Grid = document.getElementById('product-grid');

// Agregar un evento de clic a la grid de productos
productGrid.addEventListener('click', function(event) {
    // Verificar si el clic se originó en un elemento de producto
    if (event.target.classList.contains('product')) {
        // Obtener los datos del producto clickeado
        var productName = event.target.querySelector('h3').innerText;
        var productPrice = event.target.querySelector('p:nth-of-type(1)').innerText.split(' ')[1]; // Obtener el precio del producto

        // Agregar el producto al carrito
        addToCart(productName, productPrice);
    }
});
// Evento de clic para el botón "Efectivo"
document.getElementById('efectivo-btn').addEventListener('click', function() {
    var totalAmount = getTotalPrice();
    var amount = parseFloat(prompt("Ingrese el monto en efectivo:", totalAmount.toFixed(2)));
    if (!isNaN(amount)) {
        setPaymentAmount(amount);
        calculateChange(amount, totalAmount);
    } else {
        alert("Por favor, ingrese un monto válido.");
    }
});

// Evento de clic para el botón "Tarjeta"
document.getElementById('tarjeta-btn').addEventListener('click', function() {
    var totalAmount = getTotalPrice();
    var amount = parseFloat(prompt("Ingrese el monto a pagar con tarjeta:", totalAmount.toFixed(2)));
    if (!isNaN(amount)) {
        setPaymentAmount(amount);
        calculateChange(amount, totalAmount);
    } else {
        alert("Por favor, ingrese un monto válido.");
    }
});
// Evento de clic para el botón "Cigarros Efectivo"
document.getElementById('cigarros-efectivo').addEventListener('click', function() {
    var totalAmount = getTotalPrice();
    var amount = parseFloat(prompt("Ingrese el monto en efectivo para los cigarros:", totalAmount.toFixed(2)));
    if (!isNaN(amount)) {
        setPaymentAmount(amount);
        calculateChange(amount, totalAmount);
    } else {
        alert("Por favor, ingrese un monto válido.");
    }
});

// Evento de clic para el botón "Cigarros Tarjeta"
document.getElementById('cigarros-tarjeta').addEventListener('click', function() {
    var totalAmount = getTotalPrice();
    var amount = parseFloat(prompt("Ingrese el monto a pagar con tarjeta para los cigarros:", totalAmount.toFixed(2)));
    if (!isNaN(amount)) {
        setPaymentAmount(amount);
        calculateChange(amount, totalAmount);
    } else {
        alert("Por favor, ingrese un monto válido.");
    }
});

// Evento de clic para el botón "Transferencia"
document.getElementById('transferencia-btn').addEventListener('click', function() {
    var totalAmount = getTotalPrice();
    var amount = parseFloat(prompt("Ingrese el monto a transferir:", totalAmount.toFixed(2)));
    if (!isNaN(amount)) {
        setPaymentAmount(amount);
        calculateChange(amount, totalAmount);
    } else {
        alert("Por favor, ingrese un monto válido.");
    }
});
// Función para cancelar la venta
function cancelSale() {
    // Limpiar el carrito de compras
    var cart = document.getElementById('cart-items');
    cart.innerHTML = '';

    // Limpiar el precio total
    var totalPriceElement = document.querySelector('#precio-total .total');
    totalPriceElement.textContent = 'Total:';

    // Limpiar el monto de pago
    var paymentElement = document.querySelector('#pago .pago');
    paymentElement.textContent = 'Pago:';

    // Limpiar el cambio
    var changeElement = document.querySelector('#cambio .cambio');
    changeElement.textContent = 'Cambio:';
}

// Evento de clic para el botón "Cancelar venta"
document.getElementById('cancelar-venta').addEventListener('click', function() {
    cancelSale();
});
