// Animación inputs
const inputs = document.querySelectorAll(".input-box input, .input-box textarea");

inputs.forEach(input => {
    input.addEventListener("focus", () => {
        input.style.borderColor = "var(--color-primary)";
        input.style.boxShadow = "0 0 8px rgba(255, 87, 51, 0.5)";
    });

    input.addEventListener("blur", () => {
        input.style.borderColor = "#ccc";
        input.style.boxShadow = "none";
    });
});

// Animación de aparición al hacer scroll
const elements = document.querySelectorAll("section, .info-card");

const showOnScroll = () => {
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add("visible");
        }
    });
};

window.addEventListener("scroll", showOnScroll);
showOnScroll();

// =============================
// FUNCIÓN PARA MOSTRAR MENSAJES
// =============================
function mostrarMensajeContacto(mensaje, tipo) {
    // Eliminar mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.alerta-contacto');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }

    const alerta = document.createElement('div');
    alerta.className = `alerta-contacto ${tipo}`;
    alerta.innerHTML = `
        <i class="fa-solid ${tipo === 'error' ? 'fa-circle-xmark' : 'fa-circle-check'}"></i>
        <span>${mensaje}</span>
    `;

    document.body.appendChild(alerta);

    // Eliminar después de 5 segundos
    setTimeout(() => {
        alerta.style.opacity = '0';
        setTimeout(() => alerta.remove(), 300);
    }, 5000);
}

// =============================
// GUARDAR MENSAJE DE CONTACTO
// =============================
document.getElementById("formContacto").addEventListener("submit", function(e){
    e.preventDefault();

    const nombre = document.getElementById("cNombre").value.trim();
    const correo = document.getElementById("cCorreo").value.trim();
    const telefono = document.getElementById("cTelefono").value.trim();
    const mensaje = document.getElementById("cMensaje").value.trim();

    // Validar campos obligatorios
    if (!nombre || !correo || !mensaje) {
        mostrarMensajeContacto('Por favor completa todos los campos obligatorios', 'error');
        return;
    }

    let mensajes = JSON.parse(localStorage.getItem("mensajesContacto")) || [];

    const nuevoMensaje = {
        id: String(Date.now()),
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        mensaje: mensaje,
        fechaEnvio: new Date().toLocaleString()
    };

    mensajes.push(nuevoMensaje);
    localStorage.setItem("mensajesContacto", JSON.stringify(mensajes));

    mostrarMensajeContacto('¡Mensaje enviado correctamente! Te responderemos pronto.', 'exito');
    this.reset();
});