/* ---------------------------
   VALIDACIÓN DE FECHA Y HORA
----------------------------*/

// Capta los campos del formulario
const inputFecha = document.querySelector('input[type="date"]');
const inputHora = document.querySelector('.triple select:nth-child(2)');
const formReserva = document.querySelector('.reserva-form');

// Estilos para mensajes de error bonitos
function mostrarAlerta(mensaje) {
    const alerta = document.createElement('div');
    alerta.classList.add('alerta-error');
    alerta.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${mensaje}`;
    document.body.appendChild(alerta);

    setTimeout(() => alerta.remove(), 3500);
}

/* ---- FUNCIÓN PARA SABER DÍA ---- */
function obtenerDiaSemana(fecha) {
    const f = new Date(fecha + "T00:00");
    return f.getDay(); 
    // 0=Domingo, 1=Lunes… 6=Sábado
}

/* ---- BLOQUEAR DOMINGOS ---- */
inputFecha.addEventListener("change", () => {
    const dia = obtenerDiaSemana(inputFecha.value);

    if (dia === 0) {
        mostrarAlerta("❌ El restaurante está cerrado los domingos.");
        inputFecha.value = "";
        return;
    }

    generarHorasPermitidas(dia);
});

/* ---- GENERAR HORAS DEPENDIENDO EL DÍA ---- */
function generarHorasPermitidas(dia) {
    inputHora.innerHTML = `<option disabled selected>Selecciona una hora</option>`;

    let horasPermitidas = [];

    if (dia >= 1 && dia <= 4) {
        // Lunes a jueves
        horasPermitidas = generarRangoHoras(10, 21); 
    }
    else if (dia === 5 || dia === 6) {
        // Viernes y sábado
        horasPermitidas = generarRangoHoras(9, 22);
    }

    horasPermitidas.forEach(h =>
        inputHora.innerHTML += `<option>${h}</option>`
    );
}

/* ---- FUNCIÓN QUE GENERA HORAS --- */
function generarRangoHoras(horaInicio, horaFin) {
    let lista = [];
    for (let h = horaInicio; h <= horaFin; h++) {
        const ampm = h >= 12 ? "PM" : "AM";
        const hora12 = (h % 12) === 0 ? 12 : (h % 12);
        lista.push(`${hora12}:00 ${ampm}`);
    }
    return lista;
}

/* ---- VALIDAR ANTES DE GUARDAR ---- */
formReserva.addEventListener("submit", (e) => {
    e.preventDefault();

    if (inputFecha.value === "") {
        mostrarAlerta("❌ Debes seleccionar una fecha válida.");
        return;
    }

    if (inputHora.value.includes("Selecciona")) {
        mostrarAlerta("❌ Selecciona una hora dentro del horario permitido.");
        return;
    }

    // Si todo OK → guardar reserva
    guardarReserva();
});

function guardarReserva() {
    mostrarAlerta("✔ Reserva creada correctamente.");
}


