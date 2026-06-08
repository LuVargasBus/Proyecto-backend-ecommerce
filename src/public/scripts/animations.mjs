/**
 * animations.js
 * Archivo JavaScript para efectos visuales y animaciones
 * Mejora la estética y experiencia de usuario
 */

/**
 * Función para inicializar animaciones cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initInputEffects();
    initButtonEffects();
});

/**
 * Inicializa animaciones generales
 */
function initAnimations() {
    // Animación de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos que deben animarse
    const animateElements = document.querySelectorAll('.product-card, .search-section');
    animateElements.forEach(el => observer.observe(el));
}

/**
 * Efectos para el input de búsqueda
 */
function initInputEffects() {
    const searchInput = document.getElementById('productSearch');
    
    if (searchInput) {
        // Efecto de focus con animación
        searchInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });

        searchInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });

        // Efecto de escritura (pulse animation)
        searchInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.2)';
            } else {
                this.style.boxShadow = 'none';
            }
        });
    }
}

/**
 * Efectos para botones
 */
function initButtonEffects() {
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchBtn) {
        // Efecto de ripple al hacer clic
        searchBtn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    // Efectos para botones de detalles
    const detailButtons = document.querySelectorAll('.btn-details');
    detailButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Animación de carga para imágenes
 */
function initImageLoading() {
    const images = document.querySelectorAll('.product-image');
    
    images.forEach(img => {
        // Mostrar placeholder mientras carga
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });

        // Si la imagen falla al cargar
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.alt = 'Imagen no disponible';
        });
    });
}

/**
 * Efecto de hover mejorado para tarjetas
 */
function enhanceCardHovers() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateY(2deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0deg)';
        });
    });
}

/**
 * Animación de aparición gradual para elementos
 */
function fadeInElement(element, delay = 0) {
    setTimeout(() => {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 50);
    }, delay);
}

/**
 * Efecto de shake para errores
 */
function shakeElement(element) {
    element.style.animation = 'shake 0.5s';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Agregar estilos de animación dinámicos
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .product-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .type-badge {
        transition: transform 0.2s ease;
    }
    
    .type-badge:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);

// Inicializar efectos cuando se cargan nuevos elementos
if (typeof MutationObserver !== 'undefined') {
    const mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                initImageLoading();
                enhanceCardHovers();
                
                // Reinicializar efectos para botones nuevos
                const newButtons = document.querySelectorAll('.btn-details');
                newButtons.forEach(btn => {
                    if (!btn.hasAttribute('data-animated')) {
                        btn.setAttribute('data-animated', 'true');
                        btn.addEventListener('mouseenter', function() {
                            this.style.transform = 'translateY(-2px) scale(1.02)';
                        });
                        btn.addEventListener('mouseleave', function() {
                            this.style.transform = 'translateY(0) scale(1)';
                        });
                    }
                });
            }
        });
    });

    // Observar cambios en el contenedor de resultados
    const resultsContainer = document.getElementById('productCards');
    if (resultsContainer) {
        mutationObserver.observe(resultsContainer, {
            childList: true,
            subtree: true
        });
    }
}

// Función para aplicar efecto de error
if (typeof window !== 'undefined') {
    window.shakeError = function() {
        const errorMsg = document.getElementById('errorMessage');
        if (errorMsg) {
            shakeElement(errorMsg);
        }
    };
}

