# Taller: Formularios con validaciones

## 1. Descripción del proyecto

En este taller desarrollamos un formulario de registro utilizando HTML, CSS y JavaScript puro, sin utilizar frameworks ni librerías externas.

El objetivo es implementar diferentes formas de validación, comenzando con las herramientas nativas de HTML y avanzando hasta validaciones personalizadas, envío de datos con `fetch`, funciones reutilizables y conceptos básicos de seguridad y usabilidad.

El proyecto se divide en cinco niveles y utiliza JSONPlaceholder para simular el envío de información a un servidor.

## 2. Tecnologías utilizadas

- HTML5: estructura del formulario y validaciones nativas.
- CSS3: estilos, diseño adaptable y presentación de errores.
- JavaScript: eventos, validaciones personalizadas y envío de datos.
- Constraint Validation API: validaciones del navegador.
- Fetch API: comunicación con el servidor de prueba.
- FormData: recopilación de los datos.
- Visual Studio Code y Live Server: desarrollo y ejecución.
- DevTools: revisión de solicitudes y errores.
- Node.js: ejecución de pruebas automáticas.

## 3. Estructura del proyecto

```text
registro/
│
├── index.html
├── estilos.css
├── app.js
├── validaciones.js
├── seguridad.html
├── seguridad.js
├── README.md
│
├── nativo/
│   └── index.html
│
└── pruebas/
    └── validaciones.test.mjs
```

## 4. Desarrollo del taller

### Nivel 1. Validación nativa con HTML

En este nivel implementamos las validaciones utilizando atributos HTML como `required`, `minlength`, `maxlength`, `pattern`, `min`, `max` y `step`.

Comprobamos que el formulario rechaza correos incorrectos, contraseñas sin números y edades fuera del rango permitido.

También verificamos que las etiquetas están relacionadas con sus campos y que el formulario se adapta a pantallas pequeñas.

**Pregunta: ¿Qué ocurre si eliminamos el atributo `name`?**

Cuando eliminamos el atributo `name` de un campo, este sigue apareciendo en el formulario y puede seguir siendo validado, pero su valor deja de enviarse junto con los demás datos.

Esto ocurre porque `name` permite identificar cada dato en la información enviada al servidor.

**Explicación de la expresión regular de la contraseña**

Utilizamos la expresión `(?=.*[A-Za-z])(?=.*\d).{8,}`.

- `(?=.*[A-Za-z])`: comprueba que exista al menos una letra.
- `(?=.*\d)`: comprueba que exista al menos un número.
- `.{8,}`: establece un mínimo de ocho caracteres.

Por ejemplo, la contraseña `abcdefgh` fue rechazada porque no contiene números.

### Nivel 2. Mensajes de error personalizados

En este nivel utilizamos JavaScript para mostrar mensajes de error en español debajo de los campos.

También implementamos atributos de accesibilidad como `aria-describedby`, `aria-live` y `aria-invalid`.

Comprobamos que los errores aparecen cuando salimos de un campo incorrecto y desaparecen después de corregirlo.

Además, realizamos una prueba con NVDA y verificamos que el lector de pantalla anunciara el mensaje de error.

**Pregunta: ¿Cuál es la diferencia entre `:invalid` y `:user-invalid`?**

La pseudoclase `:invalid` marca los campos inválidos desde que se carga la página, incluso cuando todavía no hemos escrito nada.

En cambio, `:user-invalid` permite mostrar los errores después de una interacción relevante del usuario.

Consideramos que `:user-invalid` es mejor para la experiencia del usuario porque evita mostrar muchos errores antes de comenzar a llenar el formulario.

### Nivel 3. Envío con Fetch y FormData

En este nivel implementamos el envío de información sin recargar la página.

Utilizamos `FormData` para obtener los valores del formulario y `fetch` para realizar las peticiones.

Comprobamos que el botón se desactiva mientras se procesa el envío, que los datos se envían como JSON y que se excluye el campo de confirmación de contraseña.

También simulamos errores de conexión y respuestas HTTP incorrectas. En ambos casos, el formulario mostró un mensaje, conservó los datos y volvió a habilitar el botón.

**Pregunta: ¿Por qué utilizamos `submit` y no `click`?**

Utilizamos el evento `submit` porque permite detectar el envío del formulario tanto cuando hacemos clic en el botón como cuando presionamos Enter.

Si utilizáramos solamente `click`, estaríamos dependiendo de la interacción con el botón.

Además, utilizamos `preventDefault()` para evitar que la página se recargue automáticamente.

### Nivel 4. Validación avanzada con JavaScript

En este nivel organizamos las reglas de validación en un archivo independiente llamado `validaciones.js`.

También implementamos una comprobación asíncrona del correo electrónico, utilizando `debounce` para evitar consultas innecesarias.

Finalmente, agregamos campos dinámicos que permiten registrar hasta tres teléfonos.

Comprobamos que los teléfonos incorrectos muestran un error y que los números válidos se envían dentro de un arreglo JSON.

**Pregunta: ¿Qué ventajas tienen las funciones puras?**

Las funciones puras permiten validar datos sin modificar directamente los elementos de la página.

Esto facilita reutilizar las reglas, encontrar errores y realizar pruebas automáticas. Además, permite mantener separado el código que valida los datos del código que controla el formulario.

**Pregunta: ¿Por qué no podemos comprobar si un correo ya existe utilizando solamente HTML?**

Porque HTML puede verificar si el correo tiene un formato correcto, pero no puede consultar los datos que están guardados en el servidor.

Para comprobar si una cuenta existe necesitamos realizar una consulta al servidor. En este taller simulamos ese proceso con una lista de correos registrados y una promesa de JavaScript.

### Nivel 5. Seguridad y usabilidad

#### Parte A. Seguridad del frontend

En esta parte comprobamos que las validaciones del navegador pueden saltarse enviando peticiones directamente con JavaScript.

Realizamos una solicitud mediante `fetch` con los siguientes datos:

```json
{
  "email": "no-es-correo",
  "edad": -3
}
```

El servicio JSONPlaceholder respondió a la petición y devolvió un identificador, aunque los datos no cumplían las reglas del formulario.

Esto demuestra que no es suficiente validar únicamente desde el frontend. El backend debe volver a comprobar la información antes de guardarla o procesarla.

La prueba adicional de quitar `min` y `max` en DevTools y enviar una edad de 5 años queda pendiente de documentar.

**¿Qué es SQL injection y cómo se puede prevenir?**

SQL injection es una vulnerabilidad que puede aparecer cuando una aplicación construye consultas SQL mezclando directamente instrucciones y datos proporcionados por el usuario.

Para prevenirla debemos utilizar consultas parametrizadas, que permiten mantener separados los comandos SQL de los valores recibidos.

De esta manera, los datos no se interpretan como instrucciones ejecutables.

#### Parte B. Prevención de XSS

Realizamos una comparación visual utilizando el texto:

```html
<b>Ana</b>
```

Observamos que cuando se interpretan las etiquetas HTML, el nombre Ana aparece en negrita.

En cambio, cuando utilizamos `textContent`, las etiquetas aparecen literalmente como parte del texto.

Esto nos permitió comprender que utilizar `innerHTML` con información ingresada por usuarios puede generar vulnerabilidades XSS.

Por esta razón, en el formulario principal utilizamos `textContent` para mostrar el saludo sin interpretar etiquetas HTML.

La demostración visual se implementó creando elementos desde JavaScript, sin insertar directamente contenido arbitrario mediante `innerHTML`.

#### Parte C. Prueba de usabilidad

Para esta actividad se plantea que otra persona complete el formulario utilizando datos de prueba, incluyendo una edad inválida de 16 años.

También se debe comprobar que pueda completar el registro utilizando únicamente el teclado.

**Ejemplos simulados de problemas de usabilidad**

| Observación | Campo | Problema | Corrección propuesta |
|---|---|---|---|
| 1 | Contraseña | El participante no sabía que debía escribir una contraseña con letras y números. | Agregar una indicación visible con los requisitos de la contraseña. |
| 2 | Edad | El participante escribió una edad menor de 18 años y no comprendió inicialmente el límite. | Agregar un texto que indique que la edad debe estar entre 18 y 120 años. |

Estas observaciones son ejemplos simulados para planificar la actividad y no corresponden a resultados obtenidos con participantes reales.

**Conclusión de la actividad propuesta**

Las indicaciones visibles pueden ayudar a que los usuarios comprendan los requisitos antes de cometer errores. También es importante mantener el foco visible y permitir la navegación con teclado para mejorar la accesibilidad.

Las dos correcciones de esta sección quedan como propuestas hasta ser implementadas y comprobadas en el formulario.

## 5. Pruebas automáticas

Se creó el archivo `pruebas/validaciones.test.mjs` para comprobar las reglas principales de `validaciones.js`.

Incluye pruebas de nombre, correo, contraseña, confirmación, edad, país, términos y teléfonos.

El archivo contiene 13 aserciones que permiten verificar el comportamiento de las funciones sin necesidad de abrir el navegador.

Para ejecutar las pruebas utilizamos:

```bash
node pruebas/validaciones.test.mjs
```

También podemos revisar la sintaxis de los archivos JavaScript utilizando:

```bash
node --check app.js
node --check seguridad.js
```

Las pruebas automáticas complementan las pruebas manuales, pero no reemplazan las comprobaciones de accesibilidad, usabilidad y funcionamiento del navegador.

## 6. Evidencias de funcionamiento

Se realizaron pruebas manuales de las validaciones, mensajes personalizados, envío de datos, errores de conexión, correo registrado, teléfonos dinámicos y demostraciones de seguridad.

Las evidencias correspondientes se adjuntan en el documento de Word.

Las pruebas de usabilidad con participantes y las correcciones derivadas de ellas deben documentarse cuando se realicen.

## 7. Cómo ejecutar el proyecto

1. Abrir la carpeta `registro` en Visual Studio Code.
2. Tener instalada la extensión Live Server.
3. Abrir `index.html` utilizando Live Server.
4. Completar el formulario y probar las validaciones.
5. Abrir `nativo/index.html` para revisar el nivel 1.
6. Abrir `seguridad.html` para realizar las demostraciones del nivel 5.
7. Ejecutar las pruebas automáticas con Node.js.

## 8. Conclusiones

Durante este taller aprendimos a construir un formulario utilizando distintas técnicas de validación.

Comprendimos que HTML permite realizar validaciones básicas, mientras que JavaScript ofrece un mayor control sobre los mensajes, las reglas y el comportamiento del formulario.

También aprendimos a utilizar `fetch` y `FormData` para enviar información, implementar validaciones asíncronas y trabajar con campos dinámicos.

En cuanto a la seguridad, comprobamos que las validaciones del navegador pueden saltarse, por lo que el servidor debe validar nuevamente los datos. También entendimos la importancia de prevenir SQL injection y XSS.

Finalmente, reconocimos que un formulario no solo debe funcionar correctamente, sino que también debe ser fácil de entender y utilizar, incluyendo a las personas que navegan mediante teclado o lectores de pantalla.

Este proyecto nos permitió aplicar conceptos de HTML, CSS, JavaScript, accesibilidad, seguridad y usabilidad en una misma aplicación.