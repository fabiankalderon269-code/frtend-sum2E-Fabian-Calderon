document.addEventListener('DOMContentLoaded', function(){
	const form = document.getElementById('turnoForm');
	const mensaje = document.getElementById('mensaje');

	function validarFechaHora(fechaStr, horaStr){
		if(!fechaStr || !horaStr) return false;
		const now = new Date();
		const fecha = new Date(fechaStr + 'T' + horaStr);
		return fecha > now;
	}

	form.addEventListener('submit', function(e){
		e.preventDefault();
		mensaje.textContent = '';

		const nombre = form.nombre.value.trim();
		const apellido = form.apellido.value.trim();
		const dni = form.dni.value.trim();
		const email = form.email.value.trim();
		const especialidad = form.especialidad.value;
		const profesional = form.profesional.value;
		const fecha = form.fecha.value;
		const hora = form.hora.value;

		if(!nombre || !apellido || !dni || !email || !especialidad || !profesional || !fecha || !hora){
			mensaje.style.color = 'crimson';
			mensaje.textContent = 'Por favor complete los campos obligatorios.';
			return;
		}

		if(!validarFechaHora(fecha,hora)){
			mensaje.style.color = 'crimson';
			mensaje.textContent = 'Seleccione una fecha y hora futuras.';
			return;
		}

		// Simular envío: aquí normalmente haríamos fetch a una API
		mensaje.style.color = 'green';
		mensaje.textContent = 'Solicitud de turno enviada. Recibirá confirmación por email.';
		form.reset();
	});
});

