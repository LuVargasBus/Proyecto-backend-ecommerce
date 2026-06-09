const PRODUCTS_URL = '/api/productos';

const loading = document.getElementById('loadingIndicator');
const detail = document.getElementById('productDetail');
const error = document.getElementById('errorMessage');
const img = document.getElementById('detailImage');
const nombre = document.getElementById('detailName');
const nombreEsp = document.getElementById('detailSpanishName');
const id = document.getElementById('detailId');
const tipos = document.getElementById('detailTypes');
const descripcion = document.getElementById('detailDescription');
const peso = document.getElementById('infoWeight');
const altura = document.getElementById('infoHeight');
const exp = document.getElementById('infoBaseExp');
const habitat = document.getElementById('infoHabitat');
const habitatItem = document.getElementById('infoHabitatItem');
const crecimiento = document.getElementById('infoGrowthRate');
const crecimientoItem = document.getElementById('infoGrowthRateItem');
const habilidades = document.getElementById('abilitiesList');
const stats = document.getElementById('statsContainer');
const efectividad = document.getElementById('effectivenessContainer');
const movimientos = document.getElementById('movesList');
const cantidadMovimientos = document.getElementById('movesCount');

function getId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function getColor(category) {
    const colores = {
        superior: '#E74C3C',
        inferior: '#3498DB'
    };
    return colores[category.toLowerCase()] || '#68A090';
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
    const imageKey = String(imageName || '').toLowerCase();
    const inViews = window.location.pathname.includes('/views/');
    const imageBasePath = inViews ? '../image/' : 'image/';

    // Imágenes subidas con multer tienen extensión (ej: xY3kP9q.webp)
    if (imageKey.includes('.')) {
        return `${imageBasePath}uploads/${imageKey}`;
    }

    // Imágenes originales del seed (clave sin extensión)
    const imageFile = PRODUCT_IMAGE_FILES[imageKey];
    if (imageFile) {
        return `${imageBasePath}${imageFile}`;
    }

    return `https://placehold.co/600x600?text=${encodeURIComponent(imageName || 'producto')}`;
}

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function obtenerProducto(id) {
    const response = await fetch(`${PRODUCTS_URL}/${id}`);
    if (!response.ok) throw new Error('Producto no encontrado');
    return await response.json();
}

function actualizarHeader(producto, color) {
    img.src = getImagePath(producto.image);
    img.alt = capitalizar(producto.name);
    nombre.textContent = capitalizar(producto.name);
    nombreEsp.classList.add('hidden');
    id.textContent = `#${String(producto.id).padStart(3, '0')}`;
    tipos.innerHTML = `<span class="type-badge large" style="background-color: ${color}">${capitalizar(producto.category)}</span>`;
    descripcion.textContent = `${capitalizar(producto.name)} disponible en talles ${producto.size.join(', ')}.`;
    descripcion.classList.remove('hidden');
    document.querySelector('.detail-header').style.backgroundColor = color;
}

function actualizarInfo(producto) {
    peso.textContent = `${producto.stock} unidades`;
    altura.textContent = producto.size.join(', ');
    exp.textContent = `$${producto.price}`;
    habitatItem.classList.add('hidden');
    crecimientoItem.classList.add('hidden');
}

function actualizarHabilidades(producto) {
    habilidades.innerHTML = '';
    [`Categoria: ${producto.category}`, `Talles: ${producto.size.join(', ')}`].forEach(texto => {
        const item = document.createElement('div');
        item.className = 'ability-item';
        item.innerHTML = `<span class="ability-name">${texto}</span>`;
        habilidades.appendChild(item);
    });
}

function actualizarStats(producto, color) {
    stats.innerHTML = '';
    const metricas = [
        { nombre: 'Stock', valor: producto.stock, max: 25 },
        { nombre: 'Precio', valor: producto.price, max: 100 }
    ];

    metricas.forEach(metrica => {
        const fila = document.createElement('div');
        fila.className = 'stat-row';
        
        const header = document.createElement('div');
        header.className = 'stat-header';
        
        const nombreStat = document.createElement('span');
        nombreStat.className = 'stat-name';
        nombreStat.textContent = metrica.nombre;
        
        const numero = document.createElement('span');
        numero.className = 'stat-number';
        numero.textContent = metrica.valor;
        
        header.appendChild(nombreStat);
        header.appendChild(numero);
        
        const barraContainer = document.createElement('div');
        barraContainer.className = 'stat-bar-container';
        
        const barra = document.createElement('div');
        barra.className = 'stat-bar';
        const porcentaje = Math.min((metrica.valor / metrica.max) * 100, 100);
        barra.style.width = `${porcentaje}%`;
        barra.style.backgroundColor = color;
        
        barraContainer.appendChild(barra);
        
        fila.appendChild(header);
        fila.appendChild(barraContainer);
        
        stats.appendChild(fila);
    });
}

function actualizarEfectividad(producto, color) {
    efectividad.innerHTML = '';
    efectividad.innerHTML = `
        <div class="effectiveness-group strengths">
            <h4>Categoria del producto</h4>
            <div class="type-list">
                <span class="type-badge" style="background-color: ${color}">
                    ${capitalizar(producto.category)}
                </span>
            </div>
        </div>
    `;
}

function actualizarMovimientos(producto) {
    const movs = producto.size;
    cantidadMovimientos.textContent = `Talles disponibles: ${movs.length}`;
    
    movimientos.innerHTML = '';
    movs.forEach(m => {
        const badge = document.createElement('span');
        badge.className = 'move-badge';
        badge.textContent = m;
        movimientos.appendChild(badge);
    });
}

function mostrarDetalle(producto) {
    const color = getColor(producto.category);
    actualizarHeader(producto, color);
    actualizarInfo(producto);
    actualizarHabilidades(producto);
    actualizarStats(producto, color);
    actualizarEfectividad(producto, color);
    actualizarMovimientos(producto);
    
    loading.classList.add('hidden');
    detail.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function cargarProducto() {
    const productoId = getId();
    if (!productoId) {
        error.classList.remove('hidden');
        loading.classList.add('hidden');
        return;
    }
    
    try {
        const producto = await obtenerProducto(productoId);
        mostrarDetalle(producto);
    } catch (err) {
        console.error(err);
        loading.classList.add('hidden');
        error.classList.remove('hidden');
    }
}

window.addEventListener('DOMContentLoaded', cargarProducto);
