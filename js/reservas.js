// FUNCIÓN PARA MOSTRAR MENSAJES PERSONALIZADOS
function mostrarMensaje(mensaje, tipo) {
    // Eliminar mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje-alerta');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }

    const alerta = document.createElement('div');
    alerta.className = `mensaje-alerta ${tipo}`;
    alerta.innerHTML = `
        <i class="fa-solid ${tipo === 'error' ? 'fa-circle-xmark' : 'fa-circle-check'}"></i>
        <span>${mensaje}</span>
    `;

    const form = document.getElementById('formReserva');
    form.insertBefore(alerta, form.firstChild);

    // Eliminar después de 5 segundos
    setTimeout(() => {
        alerta.style.opacity = '0';
        setTimeout(() => alerta.remove(), 300);
    }, 5000);
}

// RESTRICCIONES DE HORARIO
function validarHorario(fechaSeleccionada, horaSeleccionada) {
    const fecha = new Date(fechaSeleccionada + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Verificar si la fecha ya pasó
    if (fecha < hoy) {
        return { valido: false, mensaje: "No puedes reservar en una fecha pasada. Por favor selecciona una fecha futura." };
    }

    const dia = fecha.getDay(); // 0 = Domingo, 1 = Lunes ...

    // Solo validar si es domingo
    if (dia === 0) {
        return { valido: false, mensaje: "Lo sentimos, los domingos estamos cerrados. Por favor selecciona otro día." };
    }

    // Todos los demás días están disponibles sin restricción de horario
    return { valido: true };
}

// VERIFICAR DISPONIBILIDAD DE RESERVAS (MÁXIMO 10 POR DÍA Y HORA)
function verificarDisponibilidad(fecha, hora) {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    
    // Contar cuántas reservas hay para esa fecha y hora específicas
    const reservasEnFechaYHora = reservas.filter(r => r.fecha === fecha && r.hora === hora);
    
    if (reservasEnFechaYHora.length >= 2) {
        return { 
            disponible: false, 
            mensaje: "Lo sentimos, ya no hay disponibilidad para esa fecha y hora. Por favor selecciona otra hora o día." 
        };
    }
    
    return { disponible: true };
}


// GUARDAR RESERVA
document.getElementById("formReserva").addEventListener("submit", function(e){
    e.preventDefault();

    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    // Validar horario (verifica domingos y fechas pasadas)
    const validacion = validarHorario(fecha, hora);
    if (!validacion.valido) {
        mostrarMensaje(validacion.mensaje, 'error');
        return;
    }

    // Verificar disponibilidad (máximo 10 reservas por fecha y hora)
    const disponibilidad = verificarDisponibilidad(fecha, hora);
    if (!disponibilidad.disponible) {
        mostrarMensaje(disponibilidad.mensaje, 'error');
        return;
    }

    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    const nuevaReserva = {
        id: String(Date.now()),
        nombre: document.getElementById("nombre").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        fecha,
        hora,
        personas: document.getElementById("personas").value,
        creado: new Date().toLocaleString()
    };

    reservas.push(nuevaReserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    mostrarMensaje("¡Reserva realizada con éxito! Te esperamos en Sabor al Instante.", 'exito');
    this.reset();
});