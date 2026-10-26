
 // Funciones de validación que no acceden al DOM

// Verificar que el campo no esté vacío
export const requerido = (msg = 'Este campo es obligatorio.') => v => {
  if (v === undefined || v === null || String(v).trim() === '') {
    return msg;
  }

  return null;
};

// Verificar la cantidad de caracteres
export const longitud = (min, max) => v => {
  if (v.length < min) {
    return `Usa al menos ${min} caracteres.`;
  }

  if (v.length > max) {
    return `Usa como máximo ${max} caracteres.`;
  }

  return null;
};

// Verificar el formato del correo
export const formatoCorreo = () => v => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
    return 'Escribe un correo válido, por ejemplo ana@mail.com.';
  }

  return null;
};

// Verificar que la edad sea un número entero
export const rangoEntero = (min, max) => v => {
  if (!/^[0-9]+$/.test(String(v))) {
    return 'Escribe un número entero.';
  }

  const n = Number(v);

  if (!Number.isSafeInteger(n)) {
    return 'Escribe un número entero.';
  }

  if (n < min) {
    return `El valor mínimo es ${min}.`;
  }

  if (n > max) {
    return `El valor máximo es ${max}.`;
  }

  return null;
};

// Verificar que dos campos tengan el mismo valor
export const igualA = (campo, msg) => (v, datos) => {
  if (v !== datos[campo]) {
    return msg;
  }

  return null;
};

// Verificar que la contraseña tenga letras y números
export const letraYNumero = () => v => {
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) {
    return 'Incluye al menos una letra y un número.';
  }

  return null;
};

// Verificar que se acepten los términos
export const aceptado = () => v => {
  if (v !== 'on') {
    return 'Debes aceptar los términos.';
  }

  return null;
};

// Verificar el formato de los teléfonos
export const telefonoValido = () => v => {
  if (!/^\+?\d{7,15}$/.test(v)) {
    return 'Usa de 7 a 15 dígitos, con + opcional.';
  }

  return null;
};

// Reglas de validación de cada campo
export const reglas = {
  nombre: [
    requerido(),
    longitud(3, 60)
  ],

  email: [
    requerido(),
    formatoCorreo()
  ],

  password: [
    requerido(),
    longitud(8, 64),
    letraYNumero()
  ],

  confirmar: [
    requerido(),
    igualA('password', 'Las contraseñas no coinciden.')
  ],

  edad: [
    requerido(),
    rangoEntero(18, 120)
  ],

  pais: [
    requerido('Elige un país.')
  ],

  terminos: [
    aceptado()
  ]
};

// Validar un campo del formulario
export function validarCampo(nombre, datos) {
  for (const regla of reglas[nombre] ?? []) {
    const error = regla(datos[nombre] ?? '', datos);

    if (error) {
      return error;
    }
  }

  return null;
}

// Validar todos los campos del formulario
export function validarFormulario(datos) {
  const errores = {};

  for (const nombre of Object.keys(reglas)) {
    const error = validarCampo(nombre, datos);

    if (error) {
      errores[nombre] = error;
    }
  }

  return errores;
}
