
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const url = new URL('../validaciones.js', import.meta.url);
const source = readFileSync(url, 'utf8');

const { validarCampo, validarFormulario, telefonoValido } =
  await import('data:text/javascript,' + encodeURIComponent(source));

// Datos correctos para realizar las pruebas
const correcto = {
  nombre: 'Ana María',
  email: 'ana@example.com',
  password: 'clave1234',
  confirmar: 'clave1234',
  edad: '18',
  pais: 'Colombia',
  terminos: 'on'
};

// Comprobar que el formulario sea válido
assert.deepEqual(validarFormulario(correcto), {});

// Validar el nombre
assert.equal(
  validarCampo('nombre', { ...correcto, nombre: 'AB' }),
  'Usa al menos 3 caracteres.'
);

// Validar el correo
assert.ok(
  validarCampo('email', { ...correcto, email: 'ana.mail.com' })
);

// Validar la contraseña
assert.ok(
  validarCampo('password', { ...correcto, password: 'abcdefgh' })
);

// Comprobar que las contraseñas coincidan
assert.ok(
  validarCampo('confirmar', { ...correcto, confirmar: 'otra1234' })
);

// Validar las edades
assert.ok(
  validarCampo('edad', { ...correcto, edad: '17' })
);

assert.ok(
  validarCampo('edad', { ...correcto, edad: '121' })
);

assert.ok(
  validarCampo('edad', { ...correcto, edad: '18.5' })
);

assert.equal(
  validarCampo('edad', { ...correcto, edad: '120' }),
  null
);

// Comprobar que se seleccione un país
assert.ok(
  validarCampo('pais', { ...correcto, pais: '' })
);

// Comprobar que se acepten los términos
assert.ok(
  validarCampo('terminos', { ...correcto, terminos: '' })
);

// Validar los números de teléfono
assert.equal(
  telefonoValido()('+573001234567'),
  null
);

assert.ok(
  telefonoValido()('abc')
);

console.log('OK: 13 comprobaciones de reglas superadas');
