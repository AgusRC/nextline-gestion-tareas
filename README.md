<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

 Sistema de Gestión de Tareas
 Nextline

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Docs
para consultar Swagger: [swagger](http://localhost:3000/api/)

la aplicacion se monta en una BD local de postgres, para pruebas locales utilice un contenedor de docker-compose con la siguiente configuracion:

```bash
version: '3.9'

services:
  postgres:
    image: postgres:14-alpine
    ports:
      - 5432:5432
    volumes:
      - ~/apps/postgres:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=local_db
      - POSTGRES_USER=postgres
      - POSTGRES_DB=postgres

```

en app.module.ts se conecta a la BD a travez de variables de entorno (archivo .env):
```bash
DB_HOST=127.0.0.1
DB_USER=postgres
DB_PASS=local_db
DB_NAME=postgres
```

## Descripcion original

RESTful API - Sistema de Gestión de Tareas
Ejercicio práctico para posición de Desarrollador Backend

Deberás crear una API REST para un sistema de gestión de tareas. A través de
este sistema un usuario podrá visualizar, agregar, editar o eliminar sus tareas
personales. Cada tarea debe tener un estado asociado, que puede ser
"pendiente", "en progreso" o "completada". Además, las rutas para acceder
a las tareas deben estar protegidas, y solo los usuarios autenticados deberían
poder acceder a ellas.

Cada tarea debe tener:
1. Título (Obligatorio)
2. Descripción (Obligatorio)
3. Estatus de compleción (Obligatorio)
4. Fecha de entrega (Obligatorio)
5. Comentarios (Opcional)
6. Creado por (Obligatorio)
7. Tags (Opcional)
8. Archivo (Opcional, no mayor a 5MB y sólo formatos .PDF; .PNG y .JPG)

Endpoints mínimos necesarios disponibles en la API:
1. GET -> Regresa información breve de todas las tareas
2. GET -> Regresa toda la información de una tarea
3. POST -> Crear una tarea
4. PUT -> Editar una tarea
5. DELETE -> Borrar una tarea

Consideraciones y requisitos adicionales:
1. El sistema debe guardar una bitácora de todos los movimientos
realizados
2. Los métodos GET deben funcionar para fines de paginación en el
Frontend y mostrar cuántos resultados encontró en cada llamada en la
misma respuesta
3. Búsqueda de tareas:
a. Un usuario puede realizar una búsqueda de tareas
b. Las tareas se ponderan según el match de sus campos con lo
siguiente:
i. Palabra clave

ii. Estatus de compleción
iii. Días restantes para vencimiento
iv. Formato de archivo

Aspectos a evaluar:
1. Uso de NestJS
2. Uso de TypeORM
3. Implementar autenticación JWT para proteger las rutas de las tareas
4. Implementar un manejo adecuado de transacciones para garantizar la
integridad de los datos en operaciones complejas
5. Estructura del proyecto
6. Documentación de endpoints
7. Uso de buenas prácticas de programación

