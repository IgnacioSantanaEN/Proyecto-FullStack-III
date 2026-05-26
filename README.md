# Proyecto Fullstack Unificado

Estructura del proyecto:

- `frontend/` — aplicación React + Vite
- `backend/` — APIs Java Spring Boot
  - `backend/producto` — servicio de productos y pedidos
  - `backend/usuario` — servicio de usuarios

## Cómo levantar el proyecto

### Frontend
1. Abrir terminal en `frontend/`
2. `npm install`
3. `npm run dev`

### Backend
1. Abrir terminal en `backend/producto/`
2. `./mvnw spring-boot:run` (o `mvn spring-boot:run` si tienes Maven instalado)

3. Abrir terminal en `backend/usuario/`
4. `./mvnw spring-boot:run`

## Conexión a la base de datos

Las aplicaciones backend usan MySQL. El archivo de configuración `backend/Conexion Railway.txt` contiene los datos de conexión de prueba.

## Nota

- La API de pedidos no existía originalmente y se agregó para alinear backend y frontend.
- El frontend ahora está preparado para consumir el backend desde `localhost`.
