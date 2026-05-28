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

	const profesionalesPorEspecialidad = {
		'Medicina General': ['Dr. Martín Gómez', 'Dra. Paula Díaz'],
		'Cardiología': ['Dra. Ana Pérez', 'Dr. Javier Torres'],
		'Ginecología': ['Dra. Sofía López', 'Dra. Camila Varela'],
		'Traumatología': ['Dr. Lucas Fernández', 'Dra. Carla Molina']
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
		if(opcion && profesionalesPorEspecialidad[opcion]){
			const opciones = profesionalesPorEspecialidad[opcion];
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

	function validarFechaHora(fechaStr, horaStr){
		if(!fechaStr || !horaStr) return false;
		const now = new Date();
		const fecha = new Date(fechaStr + 'T' + horaStr);
		return fecha > now;
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

		const fields = [
			form.nombre,
			form.apellido,
			form.dni,
			form.email,
			form.nacimiento,
			form.genero,
			form.especialidad,
			form.profesional,
			form.tipoConsulta,
			form.fecha,
			form.hora,
			form.modalidad,
			form.cobertura,
			form.motivo
		];

		let valido = fields.every(field => field.disabled || field.checkValidity());
		if(modalidad.value === 'Videoconsulta') valido = valido && plataforma.checkValidity();
		if(cobertura.value && cobertura.value !== 'Particular'){ valido = valido && form.credencial.checkValidity() && form.plan.checkValidity(); }
		if(primeraVisita.checked){ valido = valido && conocio.checkValidity(); }
		if(estudiosPrevios.checked){ valido = valido && descripcionEstudios.checkValidity(); }

		if(!valido){
			mensaje.style.color = 'crimson';
			mensaje.textContent = 'Por favor complete todos los campos requeridos antes de enviar.';
			return;
		}

		const fecha = form.fecha.value;
		const hora = form.hora.value;
		if(!validarFechaHora(fecha, hora)){
			mensaje.style.color = 'crimson';
			mensaje.textContent = 'Seleccione una fecha y hora futuras.';
			return;
		}

		mensaje.style.color = 'green';
		mensaje.textContent = 'Solicitud de turno enviada. Recibirá confirmación por email.';
		form.reset();
	});

	limpiarYDeshabilitar();
});

