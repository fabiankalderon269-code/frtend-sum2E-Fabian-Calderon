document.addEventListener('DOMContentLoaded', function(){
	const form = document.getElementById('turnoForm');
	const mensaje = document.getElementById('mensaje');
	const especialidad = document.getElementById('especialidad');
	const profesional = document.getElementById('profesional');
	const modalidad = document.getElementById('modalidad');
	const plataformaWrapper = document.getElementById('plataformaWrapper');
	const plataforma = document.getElementById('plataforma');
	const cobertura = document.getElementById('cobertura');
	const credencialWrapper = document.getElementById('credencialWrapper');
	const planWrapper = document.getElementById('planWrapper');
	const primeraVisita = document.getElementById('primeraVisita');
	const conocioWrapper = document.getElementById('conocioWrapper');
	const conocio = document.getElementById('conocio');
	const estudiosPrevios = document.getElementById('estudiosPrevios');
	const descripcionEstudiosWrapper = document.getElementById('descripcionEstudiosWrapper');
	const descripcionEstudios = document.getElementById('descripcionEstudios');

	const medicosPorEspecialidad = {
		"clinica": ["Dr. Gomez, Carlos", "Dra. Lopez, Maria"],
		"cardiologia": ["Dr. Perez, Juan", "Dra. Torres, Ana"],
		"pediatria": ["Dra. Diaz, Laura", "Dr. Soto, Pablo"],
		"ginecologia": ["Dra. Romero, Valeria", "Dra. Castro, Elena"],
		"traumatologia": ["Dr. Ramos, Sergio", "Dr. Herrera, Diego"],
		"neurologia": ["Dr. Molina, Andres", "Dra. Vargas, Cecilia"]
	};

	function setVisibility(element, visible){
		if(visible){
			element.classList.remove('hidden');
			Array.from(element.querySelectorAll('input, select, textarea')).forEach(el => el.disabled = false);
		}else{
			element.classList.add('hidden');
			Array.from(element.querySelectorAll('input, select, textarea')).forEach(el => {
				el.disabled = true;
				if(el.tagName === 'SELECT' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = '';
			});
		}
	}

	function resetProfesional(){
		profesional.innerHTML = '';
		profesional.disabled = true;
		profesional.appendChild(new Option('-- Seleccionar especialidad primero --', '', true, true));
	}

	function actualizarProfesional(){
		const opcion = especialidad.value;
		profesional.innerHTML = '';
		if(opcion && medicosPorEspecialidad[opcion]){
			const opciones = medicosPorEspecialidad[opcion];
			profesional.disabled = false;
			profesional.appendChild(new Option('-- Seleccionar --', '', true, true));
			opciones.forEach(nombre => profesional.appendChild(new Option(nombre, nombre)));
		}else{
			resetProfesional();
		}
	}

	function actualizarModalidad(){
		setVisibility(plataformaWrapper, modalidad.value === 'Videoconsulta');
	}

	function actualizarCobertura(){
		const mostrar = cobertura.value && cobertura.value !== 'Particular';
		setVisibility(credencialWrapper, mostrar);
		setVisibility(planWrapper, mostrar);
	}

	function actualizarPrimeraVisita(){
		setVisibility(conocioWrapper, primeraVisita.checked);
	}

	function actualizarEstudiosPrevios(){
		setVisibility(descripcionEstudiosWrapper, estudiosPrevios.checked);
	}

	function validarFechaNacimiento(fechaNacimiento){
		if(!fechaNacimiento) return false;
		const fecha = new Date(fechaNacimiento);
		const ahora = new Date();
		return fecha < ahora;
	}

	function validarFechaHora(fechaStr, horaStr){
		if(!fechaStr || !horaStr) return false;
		const now = new Date();
		const fecha = new Date(fechaStr + 'T' + horaStr);
		return fecha > now;
	}

	function validarTelefono(telefono){
		return telefono.trim() === '' || /^\+?[0-9\s\-]{7,20}$/.test(telefono);
	}

	function validarDNI(dni){
		return /^[0-9]{6,12}$/.test(dni.trim());
	}

	function limpiarYDeshabilitar(){
		setVisibility(plataformaWrapper, false);
		setVisibility(credencialWrapper, false);
		setVisibility(planWrapper, false);
		setVisibility(conocioWrapper, false);
		setVisibility(descripcionEstudiosWrapper, false);
		resetProfesional();
	}

	especialidad.addEventListener('change', actualizarProfesional);
	modalidad.addEventListener('change', actualizarModalidad);
	cobertura.addEventListener('change', actualizarCobertura);
	primeraVisita.addEventListener('change', actualizarPrimeraVisita);
	estudiosPrevios.addEventListener('change', actualizarEstudiosPrevios);
	form.addEventListener('reset', function(){
		setTimeout(limpiarYDeshabilitar, 0);
	});

	form.addEventListener('submit', function(e){
		e.preventDefault();
		mensaje.textContent = '';

		actualizarProfesional();
		actualizarModalidad();
		actualizarCobertura();
		actualizarPrimeraVisita();
		actualizarEstudiosPrevios();

		let valido = true;
		const errores = [];

		if(!form.nombre.value.trim()) errores.push('Completa el nombre.');
		if(!form.apellido.value.trim()) errores.push('Completa el apellido.');
		if(!validarDNI(form.dni.value)) errores.push('Ingresa un DNI válido (solo números).');
		if(!form.email.checkValidity()) errores.push('Ingresa un correo válido.');
		if(!validarTelefono(form.telefono.value)) errores.push('Ingresa un teléfono válido o deja el campo vacío.');
		if(!validarFechaNacimiento(form.nacimiento.value)) errores.push('Ingresa una fecha de nacimiento válida y anterior a hoy.');
		if(!form.genero.value) errores.push('Selecciona un género.');
		if(!form.especialidad.value) errores.push('Selecciona una especialidad.');
		if(!form.profesional.value) errores.push('Selecciona un médico.');
		if(!form.tipoConsulta.value) errores.push('Selecciona el tipo de consulta.');
		if(!form.fecha.value) errores.push('Selecciona la fecha del turno.');
		if(!form.hora.value) errores.push('Selecciona el horario del turno.');
		if(!form.modalidad.value) errores.push('Selecciona la modalidad de la consulta.');
		if(!form.cobertura.value) errores.push('Selecciona una cobertura.');
		if(!form.motivo.value.trim()) errores.push('Describe el motivo de consulta.');

		if(form.modalidad.value === 'Videoconsulta' && !plataforma.value) errores.push('Selecciona la plataforma preferida para videoconsulta.');
		if(form.cobertura.value && form.cobertura.value !== 'Particular'){
			if(!form.credencial.value.trim()) errores.push('Ingresa el número de credencial.');
			if(!form.plan.value.trim()) errores.push('Ingresa el plan.');
		}
		if(primeraVisita.checked && !conocio.value) errores.push('Selecciona cómo nos conoció.');
		if(estudiosPrevios.checked && !descripcionEstudios.value.trim()) errores.push('Describe los estudios previos.');
		if(form.fecha.value && form.hora.value && !validarFechaHora(form.fecha.value, form.hora.value)) errores.push('La fecha y hora del turno deben ser futuras.');

		if(errores.length){
			mensaje.style.color = 'crimson';
			mensaje.innerHTML = errores.map(error => `• ${error}`).join('<br>');
			return;
		}

		mensaje.style.color = 'green';
		mensaje.textContent = 'Solicitud de turno enviada. Recibirá confirmación por email.';
		form.reset();
	});

	limpiarYDeshabilitar();
});

