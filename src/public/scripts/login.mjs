const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const formMessage = document.getElementById('formMessage');

function mostrarMensaje(texto, tipo = 'error') {
    formMessage.textContent = texto;
    formMessage.classList.remove('hidden', 'success', 'error');
    formMessage.classList.add(tipo);
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        const response = await fetch('/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                email: emailInput.value.trim(),
                password: passwordInput.value
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'No se pudo iniciar sesión');
        }

        window.location.href = '/admin';
    } catch (err) {
        mostrarMensaje(err.message, 'error');
    }
});
