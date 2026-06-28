const PRODUCTS_URL = '/api/productos';

const input = document.getElementById('productSearch');
const boton = document.getElementById('searchBtn');
const loading = document.getElementById('loadingIndicator');
const resultados = document.getElementById('resultsSection');
const cards = document.getElementById('productCards');
const error = document.getElementById('errorMessage');

function mostrarLoading() {
    // Ocultar resultados y errores primero
    resultados.classList.add('hidden');
    error.classList.add('hidden');
    
    // Deshabilitar el botón de búsqueda y el input durante la carga
    boton.disabled = true;
    input.disabled = true;
    
    // Mostrar el loading (remover hidden primero)
    loading.classList.remove('hidden');
    loading.classList.remove('show'); // Asegurar que no tenga show
    
    // Forzar reflow para que el navegador registre el cambio de display
    void loading.offsetHeight;
    
    // Usar requestAnimationFrame para asegurar que el cambio de display se procese
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // Añadir clase show para activar la animación
            loading.classList.add('show');
        });
    });
}

function ocultarLoading() {
    // Habilitar el botón de búsqueda y el input nuevamente
    boton.disabled = false;
    input.disabled = false;
    
    // Remover clase show para iniciar la animación de salida
    if (loading.classList.contains('show')) {
        loading.classList.remove('show');
        
        // Después de la animación, ocultar completamente
        setTimeout(() => {
            loading.classList.add('hidden');
        }, 400); // Tiempo de la transición (0.4s)
    } else {
        // Si no tiene show, ocultar directamente
        loading.classList.add('hidden');
    }
}

function mostrarError(mensaje = 'No se encontraron productos para la busqueda.') {
    ocultarLoading();
    const errorText = error.querySelector('p');
    if (errorText) {
        errorText.textContent = mensaje;
    }
    error.classList.remove('hidden');
    resultados.classList.add('hidden');
}

function getColor(category) {
    const colores = {
        superior: '#E74C3C',
        inferior: '#3498DB'
    };
    return colores[category.toLowerCase()] || '#68A090';
}

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const PRODUCT_IMAGE_FILES = {
    remera: 'remera.webp',
    pantalon: 'pantalon.jpeg',
    buzo: 'buzo.webp',
    short: 'short.webp',
    camisa: 'camisa.jpg',
    campera: 'campera.jpeg'
};

function getImagePath(imageName) {
    const imageValue = String(imageName || '');
    const inViews = window.location.pathname.includes('/views/');
    const imageBasePath = inViews ? '../image/' : 'image/';

    // Imágenes subidas con multer tienen extensión (ej: KisSE0UeHODWZdgd49FQp.jpg).
    // Se respeta el nombre tal cual lo generó nanoid: en Linux el filesystem
    // es case-sensitive, así que forzar minúsculas rompía la búsqueda del archivo.
    if (imageValue.includes('.')) {
        return `${imageBasePath}uploads/${imageValue}`;
    }

    // Imágenes originales del seed (clave sin extensión, siempre en minúsculas)
    const imageFile = PRODUCT_IMAGE_FILES[imageValue.toLowerCase()];
    if (imageFile) {
        return `${imageBasePath}${imageFile}`;
    }

    return `https://placehold.co/600x600?text=${encodeURIComponent(imageName || 'producto')}`;
}

function getDetallePath(productId) {
    const inViews = window.location.pathname.includes('/views/');
    const basePath = inViews ? 'producto.html' : 'views/producto.html';
    return `${basePath}?id=${productId}`;
}

async function obtenerProductos() {
    const response = await fetch(PRODUCTS_URL);
    if (!response.ok) {
        throw new Error('No se pudo cargar el catalogo');
    }
    return await response.json();
}

function crearCardProducto(producto) {
    const color = getColor(producto.category);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.borderColor = color;
    
    const idFormateado = String(producto.id).padStart(3, '0');
    const talles = producto.size.map(size => `<span class="ability-badge">${size}</span>`).join('');
    
    card.innerHTML = `
        <div class="product-card-header" style="background-color: ${color};">
            <h3 class="product-name">${capitalizar(producto.name)}</h3>
            <p class="product-id">#${idFormateado}</p>
        </div>
        <div class="product-card-body">
            <div class="product-image-container">
                <img src="${getImagePath(producto.image)}" alt="${capitalizar(producto.name)}" class="product-image" loading="lazy">
            </div>
            <div class="product-categories">
                <span class="type-badge" style="background-color: ${color}">${capitalizar(producto.category)}</span>
            </div>
            <div class="product-stats">
                <div class="stat-item">
                    <span class="stat-label">Precio:</span>
                    <span class="stat-value">$${producto.price}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Stock:</span>
                    <span class="stat-value">${producto.stock}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Talles:</span>
                    <span class="stat-value">${producto.size.length}</span>
                </div>
            </div>
            <div class="product-sizes">
                <h4>Talles disponibles:</h4>
                <div class="abilities-list">
                    ${talles}
                </div>
            </div>
            <a href="${getDetallePath(producto.id)}" class="btn-details">
                Ver detalle del producto
            </a>
        </div>
    `;

    cards.appendChild(card);
    card.offsetHeight;
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            card.classList.add('fade-in');
        });
    });
}

function filtrarProductos(productos, termino) {
    const value = termino.trim().toLowerCase();
    if (!value) return productos;
    return productos.filter(producto =>
        producto.name.toLowerCase().includes(value) ||
        producto.category.toLowerCase().includes(value)
    );
}

async function buscar(nombre) {
    mostrarLoading();
    
    try {
        const productos = await obtenerProductos();
        const productosFiltrados = filtrarProductos(productos, nombre);
        cards.innerHTML = '';
        if (!productosFiltrados.length) {
            mostrarError();
            return;
        }

        productosFiltrados.forEach(crearCardProducto);
        ocultarLoading();
        resultados.classList.remove('hidden');
        error.classList.add('hidden');
        resultados.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        mostrarError('No se pudo conectar con el servicio de productos.');
    }
}

boton.addEventListener('click', () => {
    buscar(input.value.trim());
});

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscar(input.value.trim());
    }
});

input.addEventListener('input', () => {
    if (input.value.trim() === '') {
        buscar('');
    }
});

window.addEventListener('DOMContentLoaded', () => {
    buscar('');
});

