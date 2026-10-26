
import { validarCampo, validarFormulario, telefonoValido } from './validaciones.js';

const form = document.querySelector('#registro');
const boton = document.querySelector('#enviar');
const estado = document.querySelector('#mensaje');
const saludo = document.querySelector('#saludo');
const lista = document.querySelector('#telefonos');
const agregar = document.querySelector('#agregar-telefono');

const correoRegistrados = ['ana@mail.com', 'admin@mail.com'];

let idTelefono = 0;
let verificacionCorreo = 0;
let temporizadorCorreo;
let ocupado = false;

// Obtener los datos del formulario
function leerDatos() {
  const fd = new FormData(form);

  return {
    ...Object.fromEntries(fd),
    telefono: fd.getAll('telefono')
  };
}

// Mostrar los errores de los campos
function mostrarError(nombre, mensaje) {
  const campo = form.elements[nombre];
  const p = document.getElementById(`${nombre}-error`);

  if (!campo) return;

  campo.setAttribute('aria-invalid', mensaje ? 'true' : 'false');

  if (p) {
    p.textContent = mensaje ?? '';
  }
}

// Revisar que los teléfonos sean válidos
function revisarTelefonos() {
  let todosValidos = true;

  for (const input of lista.querySelectorAll('input[name="telefono"]')) {
    const error = telefonoValido()(input.value);

    input.setAttribute('aria-invalid', error ? 'true' : 'false');
    document.getElementById(`${input.id}-error`).textContent = error ?? '';

    if (error) {
      todosValidos = false;
    }
  }

  return todosValidos;
}

// Esperar antes de ejecutar una función
function debounce(fn, ms) {
  return (...args) => {
    clearTimeout(temporizadorCorreo);
    temporizadorCorreo = setTimeout(() => fn(...args), ms);
  };
}

// Simular una consulta para saber si un correo está registrado
function correoDisponible(email) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(!correoRegistrados.includes(email.toLowerCase()));
    }, 600);
  });
}

// Comprobar si el correo ya existe
const revisarCorreo = debounce(async (email, version) => {
  if (validarCampo('email', { email })) return;

  mostrarError('email', 'Comprobando disponibilidad…');

  const disponible = await correoDisponible(email);

  if (version !== verificacionCorreo || form.elements.email.value !== email) {
    return;
  }

  mostrarError(
    'email',
    disponible ? null : 'Este correo ya tiene una cuenta. ¿Quieres iniciar sesión?'
  );
}, 500);

// Revisar el correo cuando se escribe
form.elements.email.addEventListener('input', e => {
  const version = ++verificacionCorreo;

  mostrarError('email', null);
  revisarCorreo(e.target.value, version);
});

// Validar los campos al salir de ellos
form.addEventListener('focusout', e => {
  const campo = e.target;

  if (campo.name === 'telefono') {
    revisarTelefonos();
    return;
  }

  if (!campo.name) return;

  if (campo.name === 'email') {
    const texto = validarCampo('email', leerDatos());

    if (texto) {
      mostrarError('email', texto);
    }

    return;
  }

  mostrarError(campo.name, validarCampo(campo.name, leerDatos()));

  if (campo.name === 'password') {
    mostrarError('confirmar', validarCampo('confirmar', leerDatos()));
  }
});

// Actualizar errores mientras el usuario escribe
form.addEventListener('input', e => {
  const campo = e.target;

  if (
    campo.name === 'telefono' &&
    campo.getAttribute('aria-invalid') === 'true'
  ) {
    revisarTelefonos();

  } else if (
    campo.name !== 'email' &&
    campo.name &&
    campo.getAttribute('aria-invalid') === 'true'
  ) {
    mostrarError(campo.name, validarCampo(campo.name, leerDatos()));
  }

  if (
    campo.name === 'password' &&
    form.elements.confirmar.getAttribute('aria-invalid') === 'true'
  ) {
    mostrarError('confirmar', validarCampo('confirmar', leerDatos()));
  }
});

// Agregar nuevos teléfonos
agregar.addEventListener('click', () => {
  if (lista.querySelectorAll('input').length >= 3) return;

  const n = ++idTelefono;
  const fila = document.createElement('div');

  fila.className = 'telefono-fila';

  // El número del teléfono se genera desde el código
  fila.innerHTML = `
    <label for="tel-${n}">Teléfono ${n}</label>
    <input
      id="tel-${n}"
      name="telefono"
      type="tel"
      inputmode="tel"
      autocomplete="tel"
      aria-describedby="tel-${n}-error"
    >
    <p class="error" id="tel-${n}-error" aria-live="polite"></p>
    <button type="button" class="quitar">Quitar teléfono ${n}</button>
  `;

  lista.append(fila);

  agregar.disabled = lista.querySelectorAll('input').length >= 3;

  fila.querySelector('input').focus();
});

// Quitar un teléfono
lista.addEventListener('click', e => {
  if (!e.target.matches('.quitar')) return;

  e.target.closest('.telefono-fila').remove();

  agregar.disabled = false;
  agregar.focus();
});

// Enviar el formulario
form.addEventListener('submit', async e => {
  e.preventDefault();

  if (ocupado) return;

  estado.textContent = '';
  saludo.textContent = '';

  ++verificacionCorreo;
  clearTimeout(temporizadorCorreo);

  const datos = leerDatos();
  const errores = validarFormulario(datos);

  // Mostrar todos los errores encontrados
  for (const nombre of [
    'nombre',
    'email',
    'password',
    'confirmar',
    'edad',
    'pais',
    'terminos'
  ]) {
    mostrarError(nombre, errores[nombre] ?? null);
  }

  const telefonosValidos = revisarTelefonos();

  // Detener el envío si hay algún error
  if (Object.keys(errores).length || !telefonosValidos) {
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  // Desactivar el botón durante el envío
  ocupado = true;
  boton.disabled = true;
  boton.textContent = 'Enviando…';

  try {
    // Comprobar que el correo esté disponible
    const libre = await correoDisponible(datos.email);

    if (!libre) {
      mostrarError(
        'email',
        'Este correo ya tiene una cuenta. ¿Quieres iniciar sesión?'
      );

      form.elements.email.focus();
      return;
    }

    // Preparar los datos que se van a enviar
    const envio = { ...datos };

    delete envio.confirmar;

    // Enviar los datos al servidor de prueba
    const respuesta = await fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(envio)
    });

    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`);
    }

    const creado = await respuesta.json();

    // Mostrar el mensaje de éxito
    estado.textContent = `¡Cuenta creada! Id: ${creado.id} (simulación).`;

    saludo.textContent = `Hola, ${datos.nombre}`;

    // Limpiar los campos después del envío
    form.reset();
    lista.replaceChildren();

    agregar.disabled = false;

    // Limpiar los errores anteriores
    for (const control of form.querySelectorAll('[aria-invalid]')) {
      control.removeAttribute('aria-invalid');
    }

    for (const p of form.querySelectorAll('.error')) {
      p.textContent = '';
    }

  } catch (err) {
    console.error('Error de envío:', err);

    estado.textContent =
      'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.';

  } finally {
    // Volver a habilitar el botón
    ocupado = false;
    boton.disabled = false;
    boton.textContent = 'Crear cuenta';
  }
});
