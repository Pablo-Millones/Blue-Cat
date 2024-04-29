// Obtener referencia al campo de entrada de búsqueda
const searchInput = document.getElementById('search-input');

// Obtener referencia a la tabla de productos y a todas las filas de productos
const productTable = document.getElementById('product-table');
const productRows = productTable.getElementsByTagName('tr');

// Función para realizar la búsqueda y filtrar los productos
function searchProducts() {
  // Convertir el texto de búsqueda a minúsculas para que la búsqueda no sea sensible a mayúsculas y minúsculas
  const searchText = searchInput.value.toLowerCase();

  // Iterar sobre todas las filas de productos excepto la primera (encabezados)
  for (let i = 1; i < productRows.length; i++) {
    const row = productRows[i];
    // Obtener los valores de cada celda en la fila
    const productName = row.cells[1].innerText.toLowerCase();
    const barcode = row.cells[2].innerText.toLowerCase();
    const price = row.cells[3].innerText.toLowerCase();
    const quantity = row.cells[4].innerText.toLowerCase();
    const category = row.cells[5].innerText.toLowerCase();

    // Comprobar si algún valor de la fila coincide con el texto de búsqueda
    if (productName.includes(searchText) ||
        barcode.includes(searchText) ||
        price.includes(searchText) ||
        quantity.includes(searchText) ||
        category.includes(searchText)) {
      // Si hay coincidencia, mostrar la fila
      row.style.display = '';
    } else {
      // Si no hay coincidencia, ocultar la fila
      row.style.display = 'none';
    }
  }
}

// Agregar un evento de escucha para el evento de entrada en el campo de búsqueda
searchInput.addEventListener('input', searchProducts);