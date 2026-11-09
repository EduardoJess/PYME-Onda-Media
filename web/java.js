//Espera a que toda la página web esté cargada en la pantalla antes de empezar a ejecutar el código de JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Busca la primera etiqueta "form" que encuentre en el HTML para poder controlarla
    const formulario = document.querySelector("form");

    //En el momento exacto en el que el usuario pulsa el botón "Enviar", ejecuta las validaciones
    formulario.addEventListener("submit", (evento) => {
        // Por defecto, al pulsar enviar, el navegador recarga la página
        evento.preventDefault();

        // 1. CAPTURA DE CAMPOS
        const emailInput = document.getElementById("email") || document.querySelector('input[type="email"]');
        const telefonoInput = document.getElementById("telefono") || document.querySelector('input[type="tel"]');
        const codPostInput = document.getElementById("CodPost") || document.querySelector('input[placeholder="12345"]');
        const mensajeInput = document.getElementById("Mensaje") || document.querySelector('textarea');
        const proteDatosInput = document.getElementById("protedatos") || document.querySelector('input[type="checkbox"]');
        const nombreInput = document.getElementById("nombre") || document.querySelector('input[name="nombre"]');
        const apellidosInput = document.getElementById("apellido(s)") || document.getElementById("apellidos") || document.querySelector('input[name="apellido(s)"]');

        //TRIM Borra los espacios en blanco que el usuario haya metido al principio o al final del texto
        const email = emailInput ? emailInput.value.trim() : "";
        const telefono = telefonoInput ? telefonoInput.value.trim() : "";
        const codPost = codPostInput ? codPostInput.value.trim() : "";
        const mensaje = mensajeInput ? mensajeInput.value.trim() : "";
        const proteDatos = proteDatosInput ? proteDatosInput.checked : false;
        
        //CHECKED Se usa para los "checkbox" o "radio". No devuelve texto, sino un valor de verdadero o falso para saber si está marcado o no
        const tipoMensajeRadio = document.querySelector('input[name="TipoMensaje"]:checked') || document.querySelector('input[name="tipomensaje"]:checked');
        const tipoMensaje = tipoMensajeRadio ? tipoMensajeRadio.value.toLowerCase() : "";

        // 2. VALIDACIONES REQUERIDAS
        let errores = [];

        if (!email.includes("@") || !email.includes(".")) {
            errores.push("El correo electrónico debe contener '@' y '.'.");
        }
        // Cuenta cuántos caracteres o letras tiene guardadas esa variable. Lo usamos para verificar que sean exactamente 9 números. "NaN" es para comprobar que se haya escrito con números enteros
        if (telefono.length !== 9 || isNaN(telefono)) {
            errores.push("El teléfono debe tener exactamente 9 dígitos numéricos.");
        }
        if (codPost.length !== 5 || isNaN(codPost)) {
            errores.push("El código postal debe tener exactamente 5 dígitos numéricos.");
        }
        if (mensaje.length < 10) {
            errores.push("El mensaje debe tener al menos 10 caracteres.");
        }
        if (!tipoMensaje) {
            errores.push("Debe marcar un tipo de mensaje (Duda, Sugerencia, Queja u Otros).");
        }
        if (!proteDatos) {
            errores.push("Debe aceptar las condiciones de Protección de datos.");
        }

        //ERRORES.PUSH Salta un mensaje de error si alguna validación falla
        
        // 3. PROCESAMIENTO DE RESULTADOS
        if (errores.length > 0) {
            //Junta todos los mensajes de error que se hayan acumulado en la lista y los separa con un salto de línea (\n) y un guión, para que el usuario los lea ordenados
            alert("CORRIJA LOS SIGUIENTES ERRORES:\n\n- " + errores.join("\n- "));
        } else {
            // Si la validación es correcta, calcula las horas
            let horasEstimadas = 0;

            switch (tipoMensaje) {
                case "duda": horasEstimadas = 24; break;
                case "sugerencia": horasEstimadas = 72; break;
                case "queja": horasEstimadas = 12; break;
                case "otros": horasEstimadas = 48; break;
            }

            // REGLAS HORARIAS DE PENALIZACIÓN

            //Crea un objeto con la fecha y la hora exacta en el segundo preciso en el que se pulsa el botón de enviar
            const ahora = new Date();
            //Obtiene el día de la semana en formato de número del 0 al 6 (donde 0 es domingo, 1 es lunes...). Para detectar si es fin de semana
            const diaSemana = ahora.getDay(); 
            // 0 = Domingo, 6 = Sábado
            //Extrae únicamente la hora del reloj (del 0 al 23) para comprobar cuándo se realiza el envío
            const horaActual = ahora.getHours();

            if (diaSemana === 0 || diaSemana === 6) {
                horasEstimadas += 12; 
            // Fin de semana: +12 horas
            } else if (horaActual >= 18) {
                horasEstimadas += 8;  
            // Día laborable después de las 18:00: +8 horas
            }

            // Datos del usuario para mostrar en el resumen
            const txtNombre = nombreInput ? nombreInput.value.trim() : "";
            const txtApellidos = apellidosInput ? apellidosInput.value.trim() : "";

            // MENSAJE FINAL DE REVISIÓN CON LA ESTIMACIÓN DE RESPUESTA
            const resumen = `¡VALIDACIÓN CORRECTA!\n\nPor favor, revise los datos de su envío:\n\n• Nombre completo: ${txtNombre} ${txtApellidos}\n• Email: ${email}\n• Teléfono: ${telefono}\n• Código Postal: ${codPost}\n• Tipo de solicitud: ${tipoMensaje.toUpperCase()}\n• Mensaje redactado: "${mensaje}"\n\n---------------------------------------------------\nESTIMACIÓN DEL TIEMPO DE RESPUESTA:\nSu solicitud será atendida en un plazo aproximado de: ${horasEstimadas} horas.`;

            //Lanza la ventana flotante del navegador con el texto que le pasamos (la lista de errores o el resumen correcto)
            alert(resumen);

            // Envía el formulario al servidor después de cerrar el cuadro de resumen
            formulario.submit(); 
        }
    });
});