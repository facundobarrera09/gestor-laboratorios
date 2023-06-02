<h1 align="center">Gestor de Laboratorios CIASUR</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-%3E%3D9.3.0-blue.svg" />
  <a href="https://github.com/kefranabg/readme-md-generator#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/kefranabg/readme-md-generator/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/kefranabg/readme-md-generator/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/facundobarrera09/Gestor de Laboratorios CIASUR" />
  </a>
</p>

> Gestor de laboratorios CIASUR

### [Homepage](https://github.com/facundobarrera09/gestor-laboratorios.git)

## Prerequisites

- node >=9.6.2

## Install

```sh
npm i
```

## Configure

Se debe crear el archivo '.env' que contenga los siguientes datos para asegurar el correcto funcionamiento de la aplicación

```conf
PORT=[puerto del servidor]

MYSQL_HOST=[direccion de base de datos]
DATABASE=[nombre de la base de datos]
TEST_DATABASE=[nombre de la base de datos usada para tests]
DB_USER=[usuario de base de datos]
DB_PASSWORD=[constraseña de usuario]

SECRET=[string usada para la creación de tokens]
```

## Run app (production)

```sh
npm start
```

## Run app (development)

```sh
npm run dev
```

## Run tests

```sh
npm run test
```

## API Usage

### Login
  
  > **Descripción**  
  > Identificarse en el sistema y obtener TOKEN
  >
  > **Formato**  
  > POST - /api/login - Content-Type: application/json - Authorization: Bearer (token)
  >
  > **Request**  
  > ```js
  > {
  >   username: string,
  >   password: string
  > }
  > ```
  > **Response** 
  > ```js
  > {
  >   username: string,
  >   role: string,
  >   token: string
  > }
  > ```
  > ***

### Logout
  
  > **Descripción**  
  > Avisar al sistema de que el usuario esta cerrando sesión
  >
  > **Formato**  
  > POST - /api/logout - Authorization: Bearer (token)
  >
  > **Request**  
  > ```js
  > {
  >   username: string,
  >   password: string
  > }
  > ```
  > **Response** 
  > ```js
  > {
  >   username: string,
  >   role: string,
  >   token: string
  > }
  > ```
  > ***

### Users
  
  > **Descripción**  
  > Crear un usuario
  > 
  > **Formato**  
  > POST - /api/users - Content-Type: application/json - Authorization: Bearer (token (usuario debe ser admin) )
  > 
  > **Request**  
  > ```js
  > {}
  > ```
  > **Response**  
  > ```js
  > {
  >   message: string
  > }
  > ```
  > ***

### Laboratories
  
  > **Descripción**  
  > Crear un laboratorio
  > 
  > **Formato**  
  > POST - /api/laboratories - Content-Type: application/json - Authorization: Bearer (token (usuario debe ser admin) )
  > 
  > **Request**  
  > ```js
  > {
  >   username: string,
  >   password: string,
  >   role: string
  > }
  > ```
  > **Response**  
  > ```js
  > {}
  > ```
  > ***
  
  > **Descripción**  
  > Obtener información del laboratorio asociado al token del solicitante
  > 
  > **Formato**  
  > GET - /api/laboratories/ - Content-Type: application/json - Authorization: Bearer (token)
  > 
  > **Request**  
  > ```js
  > {}
  > ```
  > **Response**  
  > ```js
  > {
  >   id: integer,
  >   name: string,
  >   turnDurationMinutes: integer,
  >   ip: string,
  >   port: string,
  >   state: string (active, inactive, approval_pending)
  > }
  > ```
  > ***
  
  > **Descripción**  
  > Obtener información de los laboratorios disponibles según su estado (activos, inactivos, o pendientes de aprovación)
  > 
  > **Formato**  
  > GET - /api/laboratories/:states (states: active-inactive-approval_pending (se pueden seleccionar algunos o todos, separados por guión, ultimo necesita permisos de admin)) -  
  > Content-Type: application/json - Authorization: Bearer (token (usuario debe ser admin en algunas ocasiones) )
  > 
  > **Request**  
  > ```js
  > {}
  > ```
  > **Response**  
  > ```js
  > [{
  >   id: integer,
  >   name: string,
  >   turnDurationMinutes: integer,
  >   state: string (active, inactive, approval_pending)
  > }, ...]
  > ```
  > ***

### Turns
  
  > **Descripción**  
  > Crear un turno
  > 
  > **Formato**  
  > POST - /api/turns - Content-Type: application/json - Authorization: Bearer (token (usuario debe ser admin en algunas ocasiones) )
  > 
  > **Request**  
  > ```js
  > {
  >   date: Date,
  >   turn: integer,
  >   accesingUserId: integer (opcional),
  >   laboratoryId: integer
  > }
  > ```
  > **Response**  
  > ```js
  > {}
  > ```
  > ***

  > **Descripción**  
  > Obtener todos los turnos del usuario al que le corresponde el TOKEN
  > 
  > **Formato**  
  > GET - /api/turns - Content-Type: application/json - Authorization: Bearer (token)
  > 
  > **Request**  
  > ```js
  > {}
  > ```
  > **Response**  
  > ```js
  > [{
  >   id: integer,
  >   date: string (objeto Date en formato string),
  >   turn: integer,
  >   accessingUserId: integer,
  >   creatingUserId: integer,
  >   laboratoryId: integer
  > }, ...]
  > ```
  > ***

  > **Descripción**
  > Obtener los turnos disponibles asociados a un usuario
  > 
  > **Nota**
  > 1. Si el que solicita es un usuario, se devuelven todos los turnos del mismo.
  > 2. Si el que solicita es un laboratorio, se devuelven todos los turnos del usuario asociado al token de acceso que este utilizando el laboratorio
  > 3. Si se especifica una fecha, se devuelven todos los turnos correspondientes al usuario en esa fecha
  > 
  > **Formato**
  > GET - /api/turns/?date=AAAA-MM-DD - Content-Type: application/json - Authorization: Bearer (token)
  > 
  > **Request**
  > ```js
  > {}
  > ```
  > **Response**
  > ```js
  > [{
  >   id: integer,
  >   date: string (objeto Date en formato string),
  >   turn: integer,
  >   accessingUserId: integer,
  >   creatingUserId: integer,
  >   laboratoryId: integer
  > }, ...]
  > ```
  > ***
  
  > **Descripción**
  > Obtener los turnos disponibles de un laboratorio en un día determinado
  > 
  > **Nota**
  > Si no se especifica el parametro 'date', se considera que el turno pertenece al día actual
  > 
  > **Formato**
  > GET - /api/turns/available/:labId?date=AAAA-MM-DD - Content-Type: application/json - Authorization: Bearer (token)
  > 
  > **Request**
  > ```js
  > {}
  > ```
  > **Response**
  > ```js
  > {
  >   laboratoryId: integer,
  >   date: Date,
  >   availableTurns: [integer, ...]
  > }
  > ```
  > ***
  
  > **Descripción**
  > Obtener información detallada de los turnos de un día determinado del usuario al que le correspone el TOKEN 
  > 
  > **Nota**
  > 1. Si el usuario es administrador, se devuelven todos los turnos del día presentes en la base de datos  
  > 2. Si no se especifica el parametro 'date', se considera que el turno pertenece al día actual
  > 
  > **Formato**
  > GET - /api/turns/detailed/:labId?date=AAAA-MM-DD - Content-Type: application/json - Authorization: Bearer (token)
  > 
  > **Request**
  > ```js
  > {}
  > ```
  > **Response**
  > ```js
  > [{
  >   id: integer,
  >   date: string (objeto Date en formato string),
  >   turn: integer,
  >   accessingUserId: integer,
  >   creatingUserId: integer,
  >   laboratoryId: integer
  > }, ...]
  > ```
  > ***
  
  > **Descripción**
  > Eliminar un turno
  > 
  > **Nota**
  > 1. El usuario debe ser el mismo que creo el turno para poder eliminarlo
  > 
  > **Formato**
  > GET - /api/turns/?date=AAAA-MM-DD - Content-Type: application/json - Authorization: Bearer (token)
  > 
  > **Request**
  > ```js
  > {
  >   turnId: integer
  > }
  > ```
  > **Response**
  > ```js
  > {}
  > ```
  > ***

## Authors

👤 **Facundo Barrera**

* Website: https://github.com/facundobarrera09
* GitHub: [@facundobarrera09](https://github.com/facundobarrera09)

👤 **Cristian García**

👤 **Lucas**

***
_This README was generated by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_