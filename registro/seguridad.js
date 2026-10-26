
const prueba = document.getElementById('prueba-fetch');
const estado = document.getElementById('estado-fetch');
const respuesta = document.getElementById('respuesta-fetch');

// Enviar datos inválidos sin utilizar el formulario
prueba.addEventListener('click', async () => {
  prueba.disabled = true;
  estado.textContent = 'Enviando petición de prueba…';
  respuesta.textContent = '';

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'no-es-correo',
        edad: -3
      })
    });

    const texto = await res.text();

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${texto.slice(0, 250)}`);
    }

    estado.textContent = `HTTP ${res.status}: el servicio de pruebas respondió a los datos inválidos.`;
    respuesta.textContent = texto;

  } catch (error) {
    estado.textContent = 'No se pudo completar la petición. Revisa la conexión o la consola.';
    console.error('Demostración fetch:', error);

  } finally {
    prueba.disabled = false;
  }
});

// Comparar las formas de mostrar texto HTML
document.getElementById('probar-xss').addEventListener('click', () => {
  const nombre = document.getElementById('nombre-prueba').value;
  const html = document.getElementById('saludo-html');
  const seguro = document.getElementById('saludo-texto');

  // Preparar el saludo
  html.replaceChildren(document.createTextNode('Hola, '));

  // Mostrar Ana en negrita si se usa la etiqueta de ejemplo
  if (nombre === '<b>Ana</b>') {
    const negrita = document.createElement('b');

    negrita.textContent = 'Ana';
    html.append(negrita);

  } else {
    html.append(document.createTextNode(nombre));
  }

  // Mostrar las etiquetas como texto normal
  seguro.textContent = `Hola, ${nombre}`;
});

// Mostrar el ejemplo al abrir la página
document.getElementById('probar-xss').click();
