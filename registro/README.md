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

En este nivel creamos un formulario que permite validar los datos usando atributos HTML, sin necesidad de JavaScript.

Se implementaron siete campos: nombre, correo, contraseña, confirmación de contraseña, edad, país y aceptación de términos.

Utilizamos atributos como `required`, `minlength`, `maxlength`, `pattern`, `min`, `max` y `step`.

**Pruebas realizadas:**

| Prueba | Resultado |
|---|---|
| Enviar formulario vacío | Rechazado correctamente |
| Correo sin @ | Rechazado correctamente |
| Contraseña sin números | Rechazada correctamente |
| Edad 17 | Rechazada |
| Edad 18 | Aceptada |
| Edad 120 | Aceptada |
| Edad 121 | Rechazada |
| Etiquetas conectadas con sus campos | Correcto |
| Envío de los siete campos | Correcto |
| Adaptación a pantalla móvil | Correcto |

La prueba específica del teclado de un celular físico queda pendiente de documentar.

**Pregunta: ¿Qué ocurre si eliminamos el atributo `name`?**

Cuando eliminamos el atributo `name` de un campo, este sigue apareciendo en el formulario y puede seguir siendo validado, pero su valor deja de enviarse junto con los demás datos.

Esto ocurre porque `name` permite identificar cada dato en la información enviada al servidor.

**Explicación de la expresión regular de la contraseña:**

```javascript
(?=.*[A-Za-z])(?=.*\d).{8,}
```

- `(?=.*[A-Za-z])`: comprueba que exista al menos una letra.
- `(?=.*\d)`: comprueba que exista al menos un número.
- `.{8,}`: exige mínimo ocho caracteres.

Esta validación ayuda a comprobar que las contraseñas cumplan los requisitos establecidos.

### Nivel 2. Mensajes de error personalizados

En este nivel mejoramos las validaciones para mostrar mensajes en español debajo de cada campo.

También utilizamos atributos de accesibilidad como `aria-describedby`, `aria-invalid` y `aria-live`.

**Pruebas realizadas:**

| Prueba | Resultado |
|---|---|
| Abrir sin mostrar errores | Correcto |
| Escribir un nombre demasiado corto | Mostró mensaje y borde rojo |
| Contraseñas diferentes | Mostró error |
| Corregir la contraseña | El error desapareció |
| Comparar :invalid y :user-invalid | Correcto |
| Comprobar mensajes con NVDA | Mensaje anunciado correctamente |

**Pregunta: ¿Cuál es la diferencia entre `:invalid` y `:user-invalid`?**

La pseudoclase `:invalid` marca los campos inválidos desde que se carga la página, incluso cuando todavía no hemos escrito nada.

En cambio, `:user-invalid` permite mostrar los errores después de una interacción relevante del usuario.

Consideramos que `:user-invalid` es mejor para la experiencia del usuario porque evita mostrar muchos errores antes de comenzar a llenar el formulario.

### Nivel 3. Envío con Fetch y FormData

En este nivel implementamos el envío de información sin recargar la página.

Utilizamos `FormData` para obtener los valores y `fetch` para realizar la petición al servicio de pruebas.

También agregamos manejo de errores y bloqueamos el botón mientras se procesa el envío.

**Pruebas realizadas:**

| Prueba | Resultado |
|---|---|
| Enviar formulario válido | Correcto |
| Mostrar mensaje de éxito | Correcto |
| Limpiar formulario después del éxito | Correcto |
| Desactivar botón durante envío | Correcto |
| Mostrar todos los errores antes del envío | Correcto |
| Enfocar primer campo inválido | Correcto |
| Simular ausencia de conexión | Error manejado correctamente |
| Conservar datos cuando falla el envío | Correcto |
| Enviar JSON sin confirmar contraseña | Correcto |
| Manejar URL con error HTTP | Correcto |
| Enviar presionando Enter | Correcto |

**Pregunta: ¿Por qué utilizamos `submit` y no `click`?**

Utilizamos el evento `submit` porque permite detectar el envío del formulario tanto cuando hacemos clic en el botón como cuando presionamos Enter.

Si utilizáramos solamente `click`, estaríamos dependiendo de la interacción con el botón.

Además, utilizamos `preventDefault()` para evitar que la página se recargue automáticamente.

### Nivel 4. Validación avanzada con JavaScript

En este nivel organizamos todas las reglas en un módulo llamado `validaciones.js`, con funciones que podemos reutilizar.

También implementamos la comprobación asíncrona del correo y la posibilidad de agregar hasta tres teléfonos.

**Pruebas realizadas:**

| Prueba | Resultado |
|---|---|
| Correo registrado ana@mail.com | Detectado correctamente |
| Mensaje de disponibilidad | Correcto |
| Debounce | Una comprobación al escribir sin pausas |
| Agregar máximo tres teléfonos | Correcto |
| Eliminar un teléfono | Correcto |
| Rechazar teléfono abc | Correcto |
| Enviar dos teléfonos en arreglo JSON | Correcto |
| Centralizar reglas en validaciones.js | Correcto |

**Pregunta: ¿Qué ventajas tienen las funciones puras?**

Las funciones puras permiten validar datos sin modificar directamente los elementos de la página.

Esto facilita reutilizar las reglas, encontrar errores y realizar pruebas automáticas. Además, permite mantener separado el código que valida los datos del código que controla el formulario.

**Pregunta: ¿Por qué no podemos comprobar si un correo ya existe utilizando solamente HTML?**

Porque HTML puede verificar si el correo tiene un formato correcto, pero no puede consultar los datos que están guardados en el servidor.

Para comprobar si una cuenta existe necesitamos realizar una consulta al servidor. En este taller simulamos ese proceso con una lista de correos registrados y una promesa de JavaScript.

### Nivel 5. Seguridad y usabilidad

#### Parte A. Seguridad del frontend

Realizamos una petición directamente mediante `fetch`, enviando los siguientes datos:

```json
{
  "email": "no-es-correo",
  "edad": -3
}
```

El servicio de pruebas respondió con los datos enviados y un identificador.

Esto demuestra que es posible saltarse las validaciones del navegador y realizar solicitudes directamente.

Por eso, el backend debe volver a comprobar toda la información antes de procesarla.

La prueba adicional de eliminar `min` y `max` mediante DevTools queda pendiente de registrar como evidencia independiente.

**¿Qué es SQL injection y cómo se puede prevenir?**

SQL injection es una vulnerabilidad que puede aparecer cuando una aplicación construye consultas SQL mezclando directamente instrucciones y datos proporcionados por el usuario.

Para prevenirla debemos utilizar consultas parametrizadas, que permiten mantener separados los comandos SQL de los valores recibidos.

De esta manera, los datos no se interpretan como instrucciones ejecutables.

#### Parte B. Prevención de XSS

Realizamos una comparación visual utilizando el texto:

```html
<b>Ana</b>
```

En la demostración, una salida presentó el nombre en negrita y otra mostró las etiquetas literalmente.

Esto permite comprender la diferencia entre interpretar HTML y mostrar texto plano.

En el formulario principal utilizamos `textContent` para mostrar el saludo del usuario, evitando interpretar su nombre como código HTML.

La demostración visual utiliza elementos DOM creados mediante JavaScript; no ejecuta directamente `innerHTML` con entrada libre del usuario.

#### Parte C. Prueba de usabilidad

Para evaluar la facilidad de uso, planteamos una actividad en la que un compañero debe completar el formulario con algunos datos incorrectos, incluyendo una edad de 16 años.

También se debe repetir la actividad utilizando únicamente el teclado.

**Registro de ejemplo simulado (no corresponde a participantes reales):**

| Observación | Campo | Problema de ejemplo | Corrección propuesta |
|---|---|---|---|
| 1 | Contraseña | El participante no sabía que debía incluir letras y números e intentó continuar varias veces | Agregar una indicación visible debajo del campo explicando los requisitos |
| 2 | Edad | El participante escribió 16 y no entendió inmediatamente por qué no podía registrarse | Agregar una indicación visible de que la edad permitida es de 18 a 120 años |

**Ejemplo de tiempos simulados:**

| Participante ficticio | Primera prueba | Prueba con teclado |
|---|---|---|
| Participante A | 2 min 15 s | 2 min 50 s |
| Participante B | 1 min 48 s | 2 min 20 s |

Estos tiempos son ilustrativos y deben reemplazarse con mediciones reales si se presentan como resultados de la actividad.

**Conclusión de la actividad propuesta:**

Las indicaciones visibles pueden ayudar a que los usuarios comprendan los requisitos antes de cometer errores. También es importante mantener el foco visible y permitir la navegación con teclado para mejorar la accesibilidad.

Las dos correcciones de esta sección quedan como propuestas hasta ser implementadas y comprobadas en el formulario.

## 5. Pruebas automáticas

Se creó el archivo `pruebas/validaciones.test.mjs` para comprobar las reglas principales de `validaciones.js`.

Incluye pruebas de nombre, correo, contraseña, confirmación, edad, país, términos y teléfonos.

El código contiene 13 aserciones. En la ejecución documentada anteriormente se comprobó que las pruebas de reglas pasaban; el contador del mensaje original indicaba 12 y se ajustó a 13 para que coincida con las aserciones.

Para ejecutarlas:

```bash
node pruebas/validaciones.test.mjs
```

También se puede revisar la sintaxis de los archivos JavaScript utilizando `node --check`.

## 6. Evidencias de funcionamiento

Se realizaron comprobaciones manuales de las validaciones, mensajes personalizados, envío de datos, errores de conexión, correo registrado, teléfonos dinámicos y demostraciones de seguridad.

Evidencias recomendadas para adjuntar:

1. Formulario nativo rechazando datos incorrectos.
2. Mensaje de error cuando las contraseñas no coinciden.
3. Petición JSON observada en DevTools.
4. Correo registrado y teléfono incorrecto.
5. Petición directa con información inválida.
6. Comparación visual entre texto HTML y texto literal.
7. Prueba de usabilidad con observaciones y correcciones reales, cuando se realice.

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