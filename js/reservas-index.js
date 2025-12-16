// FORMULARIO DE RESERVA EN INDEX.HTML

// Función para mostrar mensajes
function mostrarMensajeIndex(mensaje, tipo) {
    // Eliminar mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje-alerta-index');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }

    const alerta = document.createElement('div');
    alerta.className = `mensaje-alerta-index ${tipo}`;
    alerta.innerHTML = `
        <i class="fa-solid ${tipo === 'error' ? 'fa-circle-xmark' : 'fa-circle-check'}"></i>
        <span>${mensaje}</span>
    `;

    // Insertar en el body (fixed position)
    document.body.appendChild(alerta);

    // Eliminar después de 5 segundos
    setTimeout(() => {
        alerta.style.opacity = '0';
        setTimeout(() => alerta.remove(), 300);
    }, 5000);
}

// Función para convertir hora al formato AM/PM - DEBE ESTAR ANTES DE USARSE
function convertirHora(hora24) {
    const horaNum = parseInt(hora24.split(':')[0]);
    
    if (horaNum === 12) return "12:00 PM";
    if (horaNum === 0) return "12:00 AM";
    if (horaNum < 12) return `${String(horaNum).padStart(2, '0')}:00 AM`;
    
    return `${String(horaNum - 12).padStart(2, '0')}:00 PM`;
}

// Validar horario (domingos cerrados y fechas pasadas)
function validarReservaIndex(fechaSeleccionada) {
    const fecha = new Date(fechaSeleccionada + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Verificar si la fecha ya pasó
    if (fecha < hoy) {
        return { valido: false, mensaje: "No puedes reservar en una fecha pasada. Por favor selecciona una fecha futura." };
    }

    const dia = fecha.getDay(); // 0 = Domingo

    // Validar si es domingo
    if (dia === 0) {
        return { valido: false, mensaje: "Lo sentimos, los domingos estamos cerrados. Por favor selecciona otro día." };
    }

    return { valido: true };
}

// VERIFICAR DISPONIBILIDAD DE RESERVAS (MÁXIMO 10 POR DÍA Y HORA)
function verificarDisponibilidadIndex(fecha, hora) {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    
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

// Manejar el envío del formulario - ESPERAR A QUE EL DOM ESTÉ LISTO
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.querySelector('.section-booking-table .contact-form');
    
    if (!formulario) {
        console.error('No se encontró el formulario de reservas');
        return;
    }

    formulario.addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = document.getElementById('name').value.trim();
        const correo = document.getElementById('email').value.trim();
        const telefono = document.getElementById('phone').value.trim();
        const fecha = document.getElementById('date').value;
        const hora = document.getElementById('time').value;
        const personas = document.getElementById('number-person').value;

        // Validar que todos los campos estén completos
        if (!nombre || !correo || !telefono || !fecha || !hora || !personas) {
            mostrarMensajeIndex('Por favor completa todos los campos', 'error');
            return; // NO limpiar el formulario aquí
        }

        // Convertir la hora al formato correcto primero
        const horaFormateada = convertirHora(hora);

        // Validar horario (domingos y fechas pasadas)
        const validacion = validarReservaIndex(fecha);
        if (!validacion.valido) {
            mostrarMensajeIndex(validacion.mensaje, 'error');
            return; // NO limpiar el formulario aquí
        }

        // Verificar disponibilidad (máximo 10 reservas por fecha y hora)
        const disponibilidad = verificarDisponibilidadIndex(fecha, horaFormateada);
        if (!disponibilidad.disponible) {
            mostrarMensajeIndex(disponibilidad.mensaje, 'error');
            return; // NO limpiar el formulario aquí
        }

        // Obtener reservas existentes
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

        // Crear nueva reserva
        const nuevaReserva = {
            id: String(Date.now()),
            nombre: nombre,
            correo: correo,
            telefono: telefono,
            fecha: fecha,
            hora: horaFormateada,
            personas: personas,
            creado: new Date().toLocaleString()
        };

        // Agregar a las reservas
        reservas.push(nuevaReserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));

        // Mostrar mensaje de éxito
        mostrarMensajeIndex('¡Reserva realizada con éxito! Te esperamos en Sabor al Instante.', 'exito');

        // SOLO limpiar formulario cuando la reserva fue exitosa
        formulario.reset();
    });
});