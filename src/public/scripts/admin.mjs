const PRODUCTS_URL = '/api/productos';

const logoutBtn = document.getElementById('logoutBtn');

const form = document.getElementById('productForm');
const formTitle = document.getElementById('formTitle');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const tableBody = document.getElementById('productsTableBody');

const idInput = document.getElementById('productId');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const categoryInput = document.getElementById('category');
const sizeInput = document.getElementById('size');
const stockInput = document.getElementById('stock');
const imageInput = document.getElementById('image');
const currentImageInfo = document.getElementById('currentImageInfo');

function mostrarMensaje(texto, tipo = 'success') {
    formMessage.textContent = texto;
    formMessage.classList.remove('hidden', 'success', 'error');
    formMessage.classList.add(tipo);
}

function ocultarMensaje() {
    formMessage.classList.add('hidden');
}

function limpiarFormulario() {
    form.reset();
    idInput.value = '';
    currentImageInfo.textContent = '';
    currentImageInfo.classList.add('hidden');
    formTitle.textContent = 'Nuevo producto';
    submitBtn.textContent = 'Guardar';
    cancelBtn.classList.add('hidden');
}

function cargarProductoEnFormulario(producto) {
    idInput.value = producto.id;
    nameInput.value = producto.name;
    priceInput.value = producto.price;
    categoryInput.value = producto.category;
    sizeInput.value = (producto.size || []).join(',');
    stockInput.value = producto.stock;
    imageInput.value = '';

    if (producto.image) {
        currentImageInfo.textContent = `Imagen actual: ${producto.image} (subí un archivo solo si querés reemplazarla)`;
        currentImageInfo.classList.remove('hidden');
    } else {
        currentImageInfo.textContent = 'Este producto no tiene imagen cargada todavía.';
        currentImageInfo.classList.remove('hidden');
    }

    formTitle.textContent = `Editando producto #${producto.id}`;
    submitBtn.textContent = 'Actualizar';
    cancelBtn.classList.remove('hidden');
    ocultarMensaje();
    form.scrollIntoView({ behavior: 'smooth' });
}

function construirFormDataDesdeFormulario() {
    const formData = new FormData();
    formData.append('name', nameInput.value.trim());
    formData.append('price', priceInput.value);
    formData.append('category', categoryInput.value.trim());
    formData.append('size', sizeInput.value);
    formData.append('stock', stockInput.value);

    if (imageInput.files[0]) {
        formData.append('imagen', imageInput.files[0]);
    }

    return formData;
}

async function obtenerProductos() {
    const response = await fetch(PRODUCTS_URL);
    if (!response.ok) throw new Error('No se pudo cargar el listado de productos');
    return await response.json();
}

async function obtenerProducto(id) {
    const response = await fetch(`${PRODUCTS_URL}/${id}`);
    if (!response.ok) throw new Error('Producto no encontrado');
    return await response.json();
}

async function crearProducto(formData) {
    // No seteamos Content-Type a mano: el navegador arma el boundary de multipart/form-data solo
    const response = await fetch(PRODUCTS_URL, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'No se pudo crear el producto');
    }
    return await response.json();
}

async function actualizarProducto(id, formData) {
    const response = await fetch(`${PRODUCTS_URL}/${id}`, {
        method: 'PUT',
        body: formData
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'No se pudo actualizar el producto');
    }
    return await response.json();
}

async function eliminarProducto(id) {
    const response = await fetch(`${PRODUCTS_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'No se pudo eliminar el producto');
    }
}

function crearFilaProducto(producto) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${producto.id}</td>
        <td>${producto.name}</td>
        <td>$${producto.price}</td>
        <td>${producto.category}</td>
        <td>${(producto.size || []).join(', ')}</td>
        <td>${producto.stock}</td>
        <td class="admin-actions">
            <button type="button" class="btn-edit" data-id="${producto.id}">Editar</button>
            <button type="button" class="btn-delete" data-id="${producto.id}">Eliminar</button>
        </td>
    `;
    return fila;
}

async function refrescarListado() {
    try {
        const productos = await obtenerProductos();
        tableBody.innerHTML = '';
        productos.forEach(producto => {
            tableBody.appendChild(crearFilaProducto(producto));
        });
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
}

async function manejarEdicion(id) {
    try {
        const producto = await obtenerProducto(id);
        cargarProductoEnFormulario(producto);
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
}

async function manejarEliminacion(id) {
    if (!window.confirm(`¿Eliminar el producto #${id}?`)) return;

    try {
        await eliminarProducto(id);
        mostrarMensaje('Producto eliminado correctamente.', 'success');
        if (idInput.value === String(id)) limpiarFormulario();
        await refrescarListado();
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
}

tableBody.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const id = target.dataset.id;
    if (!id) return;

    if (target.classList.contains('btn-edit')) {
        manejarEdicion(id);
    } else if (target.classList.contains('btn-delete')) {
        manejarEliminacion(id);
    }
});

cancelBtn.addEventListener('click', () => {
    limpiarFormulario();
    ocultarMensaje();
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    ocultarMensaje();

    const formData = construirFormDataDesdeFormulario();
    const id = idInput.value;

    try {
        if (id) {
            await actualizarProducto(id, formData);
            mostrarMensaje('Producto actualizado correctamente.', 'success');
        } else {
            await crearProducto(formData);
            mostrarMensaje('Producto creado correctamente.', 'success');
        }
        limpiarFormulario();
        await refrescarListado();
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
});

async function verificarSesion() {
    const response = await fetch('/api/usuarios/perfil');
    if (response.status === 401) {
        window.location.href = '/login';
        return false;
    }
    return true;
}

logoutBtn.addEventListener('click', async () => {
    await fetch('/api/usuarios/logout', { method: 'POST' });
    window.location.href = '/login';
});

window.addEventListener('DOMContentLoaded', async () => {
    const sesionValida = await verificarSesion();
    if (sesionValida) await refrescarListado();
});
