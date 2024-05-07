//variable del coste total de la venta
var totalPrice = 0;
//variable del pago total de la venta
var totalPayment = 0;
// variable de la diferencia entre el coste y el pago
var change = 0;
// array con el metodo de pago y monto total de cada uno
var paymentRecords = []
// nombre y precio de cada producto agregado al carrito
var cartItemsArray = [];

document.querySelector('.pagar-btn').addEventListener('click', function () {
    // Obtener el costo total de la venta
    var totalPrice = getTotalPrice();
    // Calcular la diferencia entre el costo y el pago
    var change = totalPayment - totalPrice;

    // Obtener el nombre, cantidad y precio de cada producto agregado al carrito
    var cartItemsArray = storeCartItems();
    var paymentRecords = storePaymentsRecord();
    // Crear el contenido del recibo
    var receiptContent = `
        <h1>Recibo de Venta</h1>
        <p><strong>Costo total de la venta:</strong> $${totalPrice.toFixed(2)}</p>
        <p><strong>Pago total de la venta:</strong> $${totalPayment.toFixed(2)}</p>
        <p><strong>Diferencia entre el costo y el pago:</strong> $${change.toFixed(2)}</p>
        <p><strong>Productos:</strong></p>
        <ul>
    `;
    cartItemsArray.forEach(function (item) {
        receiptContent += `<li>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`;
    });
    receiptContent += `
        </ul>
        <p><em>¡Gracias por su compra!</em></p>
    `;

    // Crear un nuevo documento HTML con el contenido del recibo
    var receiptDocument = document.implementation.createHTMLDocument('Recibo de Venta');
    receiptDocument.body.innerHTML = receiptContent;

    // Abrir el recibo en una nueva ventana
    var receiptWindow = window.open('', 'Recibo de Venta', 'width=600,height=800');
    receiptWindow.document.write(receiptDocument.documentElement.outerHTML);
    receiptWindow.document.close();

    // Opción para imprimir el recibo físicamente
    receiptWindow.print();

    // Cerrar la ventana después de imprimir o cancelar la impresión
    receiptWindow.onafterprint = function () {
        receiptWindow.close();
    };

    // Convertir paymentRecords a JSON
    var paymentRecordsJson = JSON.stringify(paymentRecords);

    // Convertir cartItemsArray a JSON
    var cartItemsArrayJson = JSON.stringify(cartItemsArray);

    // Enviar los datos a través de AJAX a ../assets/PHP/pedidos.php
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../assets/PHP/pedidos.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // La solicitud se completó y la respuesta está lista
            console.log(xhr.responseText);
            // Aquí puedes manejar la respuesta del servidor si es necesario
        }
    };

    // Crear un objeto con los datos que no son arrays
    var saleData = {
        totalPrice: totalPrice,
        totalPayment: totalPayment,
        change: change
    };
    console.log(saleData)
    // Convertir el objeto a JSON
    var saleDataJson = JSON.stringify(saleData);

    // Enviar todos los datos como JSON
    xhr.send(JSON.stringify({ saleData: saleDataJson, paymentRecords: paymentRecordsJson, cartItemsArray: cartItemsArrayJson }));

    xhr.send(queryString);
});





// Función para almacenar productos, precios y cantidades del carrito en un array
function storeCartItems() {
    // Array para almacenar los productos, precios, cantidades y IDs del carrito
    var cartItemsArray = [];

    // Obtener la lista de elementos del carrito
    var cartItems = document.getElementById('cart-items').getElementsByTagName('li');

    // Recorrer cada elemento del carrito y extraer el nombre, precio, cantidad y ID del producto
    for (var i = 0; i < cartItems.length; i++) {
        var itemText = cartItems[i].innerText;
        // Buscar el índice del símbolo del dólar
        var dollarIndex = itemText.indexOf('$');
        // Extraer el precio a partir del índice del símbolo del dólar
        var itemPrice = parseFloat(itemText.substring(dollarIndex + 1).trim());
        // Extraer el nombre del producto y la cantidad
        var itemNameWithQuantity = itemText.substring(0, dollarIndex).trim();
        var quantityIndex = itemNameWithQuantity.lastIndexOf('x');
        var itemName = itemNameWithQuantity.substring(0, quantityIndex).trim();
        var itemQuantity = parseInt(itemNameWithQuantity.substring(quantityIndex + 1).trim());
        // Obtener el id_producto del atributo data-id del elemento li
        var idProducto = cartItems[i].getAttribute('data-id');
        // Agregar el producto, precio, cantidad e ID al array
        cartItemsArray.push({ id_producto: idProducto, name: itemName, price: itemPrice, quantity: itemQuantity });
    }

    // Devolver el array con los productos, precios, cantidades e IDs del carrito
    return cartItemsArray;
}

var paymentRecords = []; // Inicializar paymentRecords como un array vacío

// Función para agregar un nuevo registro de pago
function setPaymentAmountAndType(paymentType) {
    // Obtener el precio total de los productos en el carrito
    var totalPrice = getTotalPrice();

    // Calcular el total de los pagos registrados
    var totalPaymentRegistered = paymentRecords.reduce(function (total, record) {
        return total + record.value;
    }, 0);

    // Calcular la diferencia entre el total de los pagos y el total de los productos
    var difference = Math.abs(totalPaymentRegistered - totalPrice);

    // Solicitar el monto pagado, utilizando la diferencia como valor por defecto
    var amount = parseFloat(prompt('Ingrese el monto pagado:', difference));
    console.log("Monto ingresado:", amount);
    if (!isNaN(amount)) {
        // Ajustar el monto para asegurarse de que sea positivo
        amount = Math.max(amount, 0);

        // Almacenar el monto pagado en el objeto de registros de pago
        paymentRecords.push({ name: paymentType, value: amount });
        console.log("paymentRecords después de agregar el monto:", paymentRecords);

        // Sumar el monto pagado al total de pagos
        totalPayment = paymentRecords.reduce(function (total, record) {
            return total + record.value;
        }, 0);
        console.log("Total de pagos actualizado:", totalPayment);

        // Mostrar y sumar todos los métodos de pago
        var paymentString = 'Pago: ';
        paymentRecords.forEach(function (record) {
            paymentString += record.name + ': $' + record.value.toFixed(2) + ', ';
        });
        paymentString += 'Total: $' + totalPayment.toFixed(2);

        // Obtener el elemento de pago
        var paymentElement = document.querySelector('#pago .pago');

        // Mostrar el monto y el tipo de pago en el elemento
        paymentElement.textContent = paymentString;

        // Calcular el cambio
        calculateChange(totalPayment, totalPrice);
    }
}

// Función para almacenar registros de pagos en un array
function storePaymentsRecord() {
    return paymentRecords; // Devolver el array con los registros de pagos
}

// Función para manejar el click en el botón de PAGAR
document.querySelector('.pagar-btn').addEventListener('click', function () {
    // Almacenar los productos y precios del carrito en un array
    var cartItems = storeCartItems();
    // Mostrar los productos y precios del carrito en la consola
    console.log(cartItems);
});



// Función para cargar los productos desde el servidor
function loadProducts() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../assets/PHP/obtener_productos_punto_venta.php', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var productos = JSON.parse(xhr.responseText);
            var productGrid = document.getElementById('product-grid');
            productGrid.innerHTML = ''; // Limpiamos el contenido previo del contenedor

            productos.forEach(function (producto) {
                var idProducto = producto.id_producto;
                // Crear el contenedor del producto
                var productDiv = document.createElement('div');
                productDiv.classList.add('product');

                // Crear un div invisible que cubra toda la tarjeta del producto
                var overlayDiv = document.createElement('div');
                overlayDiv.classList.add('overlay');
                overlayDiv.addEventListener('click', function () {
                    addToCart(producto.nombre_producto, parseFloat(producto.precio_venta), idProducto);
                });

                // Agregar el nombre del producto como un elemento clicable
                var productName = document.createElement('h3');
                productName.textContent = producto.nombre_producto;

                // Agregar el precio del producto como un elemento clicable
                var productPrice = document.createElement('p');
                productPrice.textContent = '$' + parseFloat(producto.precio_venta).toFixed(2);

                // Agregar el código de barras del producto como un elemento clicable
                var productBarcode = document.createElement('p');
                productBarcode.textContent = producto.codigo_de_barras;

                // Agregar los elementos al contenedor del producto
                productDiv.appendChild(overlayDiv); // Agregar el div de superposición primero para que esté en la parte superior
                productDiv.appendChild(productName);
                productDiv.appendChild(productPrice);
                productDiv.appendChild(productBarcode);

                // Agregar el contenedor del producto a la grid
                productGrid.appendChild(productDiv);
            });

            // Llamar a la función para permitir la modificación del precio después de cargar los productos
            modifyProductPrice();
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

// Agregar un evento de escucha para la tecla "Suprimir" (Delete)
document.addEventListener('keydown', function (event) {
    if (event.key === 'Delete') {
        removeFromCart();
    }
});

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
        getTotalPrice();
    }
}

// Función para agregar productos al carrito
function addToCart(productName, productPrice, idProducto) {
    // Verificar si el producto ya está en el carrito
    var existingItem = document.querySelector('#cart-items li[data-name="' + productName + '"]');

    // Si el producto ya está en el carrito, actualizar la cantidad y el precio total
    if (existingItem) {
        // Obtener la cantidad actual del producto
        var currentQuantity = parseInt(existingItem.getAttribute('data-quantity'));
        // Incrementar la cantidad
        currentQuantity++;
        // Actualizar la cantidad en el atributo de datos
        existingItem.setAttribute('data-quantity', currentQuantity);
        // Actualizar el precio total
        var totalPrice = currentQuantity * productPrice;
        existingItem.innerText = productName + ' x' + currentQuantity + ' ' + '$' + totalPrice.toFixed(2);
    } else {
        // Si el producto no está en el carrito, crear un nuevo elemento de lista para el producto
        var cartItem = document.createElement('li');
        // Establecer atributos de datos para el nombre del producto y la cantidad
        cartItem.setAttribute('data-name', productName);
        cartItem.setAttribute('data-quantity', 1);
        // Agregar el id_producto al elemento de lista
        cartItem.setAttribute('data-id', idProducto);
        // Formatear el texto con el nombre del producto, cantidad y precio
        cartItem.innerText = productName + ' x1 ' + '$' + productPrice.toFixed(2);
        // Agregar el elemento de lista al carrito
        var cart = document.getElementById('cart-items');
        cart.appendChild(cartItem);
    }

    // Calcular y mostrar el nuevo precio total
    getTotalPrice();
    calculateChange();
}




// Función para obtener el precio total de los productos en el carrito
function getTotalPrice() {
    // Obtener referencia al carrito de compras
    var cart = document.getElementById('cart-items');

    // Obtener todos los elementos de lista dentro del carrito
    var cartItems = cart.getElementsByTagName('li');

    totalPrice = 0;

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

    return totalPrice;
}







// Agregar event listeners a los botones de método de pago
document.getElementById('efectivo-btn').addEventListener('click', function () {
    setPaymentAmountAndType('Efectivo');
});

document.getElementById('tarjeta-btn').addEventListener('click', function () {
    setPaymentAmountAndType('Tarjeta');
});

document.getElementById('cigarros-efectivo').addEventListener('click', function () {
    setPaymentAmountAndType('Cigarros Efectivo');
});

document.getElementById('cigarros-tarjeta').addEventListener('click', function () {
    setPaymentAmountAndType('Cigarros Tarjeta');
});

document.getElementById('transferencia-btn').addEventListener('click', function () {
    setPaymentAmountAndType('Transferencia');
});


// Función para calcular el cambio
function calculateChange(paymentAmount) {
    // Obtener el precio total de los productos en el carrito
    var totalPrice = getTotalPrice();

    // Calcular la diferencia entre el pago y el total
    change = paymentAmount - totalPrice;

    // Obtener el elemento de cambio
    var changeElement = document.querySelector('#cambio .cambio');

    // Mostrar el cambio en el elemento
    changeElement.textContent = 'Cambio: $' + change.toFixed(2);
}



// Obtener referencia al contenedor de productos
const product_Grid = document.getElementById('product-grid');

// Agregar un evento de clic a la grid de productos
productGrid.addEventListener('click', function (event) {
    // Verificar si el clic se originó en un elemento de producto
    if (event.target.classList.contains('product')) {
        // Obtener los datos del producto clickeado
        var productName = event.target.querySelector('h3').innerText;
        var productPrice = event.target.querySelector('p:nth-of-type(1)').innerText.split(' ')[1]; // Obtener el precio del producto

        // Agregar el producto al carrito
        addToCart(productName, productPrice);
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
document.getElementById('cancelar-venta').addEventListener('click', function () {
    cancelSale();
});


// Función para manejar el escaneo del código de barras
function handleBarcodeScan(barcode) {
    console.log('Código de barras escaneado:', barcode); // Verificar si el valor del código de barras se está capturando correctamente

    // Realizar una solicitud AJAX para obtener la lista de productos
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../assets/PHP/obtener_productos_punto_venta.php', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var productos = JSON.parse(xhr.responseText);
            console.log('Productos obtenidos:', productos); // Verificar si se obtiene la lista de productos correctamente

            // Iterar sobre los productos para encontrar el que coincide con el código de barras escaneado
            for (var i = 0; i < productos.length; i++) {
                if (productos[i].codigo_de_barras === barcode) {
                    console.log('Producto encontrado:', productos[i]); // Verificar si se encuentra el producto correspondiente al código de barras
                    // Una vez encontrado el producto, agregarlo al carrito
                    addToCart(productos[i].nombre_producto, parseFloat(productos[i].precio_venta));
                    // Salir del bucle una vez que se agregue el producto al carrito
                    return;
                }
            }
            // Si no se encuentra ningún producto con el código de barras escaneado, mostrar un mensaje de error
            alert('Producto no encontrado. Por favor, escanee otro código de barras.');
        }
    };
    xhr.send();
}



// Escuchar el evento del lector de código de barras
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
        // Obtener el valor del campo de entrada donde se escanea el código de barras
        var barcodeValue = document.activeElement.value;
        console.log('Valor del código de barras:', barcodeValue); // Verificar si el valor del código de barras se está capturando correctamente
        // Limpiar el campo de entrada después de escanear el código de barras
        document.activeElement.value = '';
        // Manejar el escaneo del código de barras
        handleBarcodeScan(barcodeValue);
    }
});

// Función para manejar los atajos de teclado
function handleShortcut(event) {
    switch (event.key) {
        case 'Insert':
            document.getElementById('efectivo-btn').click();
            break;
        case 'Home':
            document.getElementById('tarjeta-btn').click();
            break;
        case 'PageUp':
            document.getElementById('cigarros-efectivo').click();
            break;
        case 'PageDown':
            document.getElementById('cigarros-tarjeta').click();
            break;
        case 'End':
            document.getElementById('transferencia-btn').click();
            break;
        default:
            break;
    }
}

function modifyProductPrice() {
    // Obtener referencia al carrito de compras
    var cart = document.getElementById('cart-items');

    // Agregar un event listener a cada elemento del carrito
    cart.addEventListener('click', function (event) {
        // Verificar si el clic se originó en un elemento de producto
        if (event.target.tagName === 'LI') {
            // Obtener el texto del elemento de lista
            var itemText = event.target.innerText;

            // Extraer el nombre y el precio del producto del texto
            var productName = itemText.split(' .......')[0];
            var currentPrice = parseFloat(itemText.split('$')[1]);

            // Solicitar al usuario el nuevo precio
            var newPrice = parseFloat(prompt('Ingrese el nuevo precio para ' + productName + ':', currentPrice));

            // Verificar si el nuevo precio es válido
            if (!isNaN(newPrice) && newPrice >= 0) {
                // Eliminar el precio anterior del texto del elemento de lista
                var newText = itemText.replace(/\$[\d,]+\.\d{2}/, ''); // Elimina el precio en formato $X.XX

                // Agregar el nuevo precio al texto del elemento de lista
                newText += '$' + newPrice.toFixed(2);

                // Reemplazar el texto del elemento de lista con el nuevo texto
                event.target.innerText = newText;

                // Recalcular el precio total
                getTotalPrice();

                // Recalcular el cambio con el nuevo precio
                var totalPayment = getTotalPrice();
                calculateChange(totalPayment);
            } else {
                // Si el usuario cancela o ingresa un precio inválido, no hacer ningún cambio
                alert('Precio inválido. No se realizaron cambios.');
            }
        }


    });
}
// Agregar un event listener para el evento keydown
document.addEventListener('keydown', function (event) {
    // Manejar el atajo de teclado solo si la tecla presionada es "|"
    if (event.key === '|') {
        // Obtener referencia al último elemento agregado al carrito
        var lastCartItem = document.getElementById('cart-items').lastElementChild;
        // Verificar si hay un elemento en el carrito
        if (lastCartItem) {
            // Obtener el texto del último elemento del carrito
            var itemText = lastCartItem.innerText;
            // Extraer el nombre del producto
            var productName = itemText.split('')[0];
            // Obtener el precio actual del producto
            var currentPrice = parseFloat(itemText.split('$')[1]);
            // Solicitar al usuario el nuevo precio
            var newPrice = parseFloat(prompt('Ingrese el nuevo precio para ' + productName + ':', currentPrice));
            // Verificar si el nuevo precio es válido
            if (!isNaN(newPrice) && newPrice >= 0) {
                // Eliminar el precio anterior del texto del elemento de lista
                var newText = itemText.replace(/\$[\d,]+\.\d{2}/, ''); // Elimina el precio en formato $X.XX

                // Agregar el nuevo precio al texto del elemento de lista
                newText += '$' + newPrice.toFixed(2);

                // Reemplazar el texto del elemento de lista con el nuevo texto
                lastCartItem.innerText = newText;

                // Recalcular el precio total
                getTotalPrice();

                // Recalcular el cambio con el nuevo precio
                var totalPayment = getTotalPrice();
                calculateChange(totalPayment);
            } else {
                // Si el usuario cancela o ingresa un precio inválido, no hacer ningún cambio
                alert('Precio inválido. No se realizaron cambios.');
            }
        }
    }
    totalPrice = getTotalPrice();

});

// Agregar un event listener para el evento keydown
document.addEventListener('keydown', handleShortcut);

// Función para enfocar el campo de búsqueda al cargar la página
function focusSearchInput() {
    // Obtener referencia al campo de entrada de búsqueda
    var searchInput = document.getElementById('search-input');
    // Enfocar el campo de entrada
    searchInput.focus();
}

// Llamar a la función para enfocar el campo de búsqueda al cargar la página
focusSearchInput();