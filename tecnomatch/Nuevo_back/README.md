# TecnoMatch Backend

Este proyecto es el backend de TecnoMatch, una plataforma para la gestión de usuarios, carreras y estadísticas académicas. Está construido con Node.js, Express y Prisma ORM.

## Estructura del Proyecto

- `src/` - Código fuente principal
  - `app.js` - Archivo principal de la aplicación Express
  - `controllers/` - Lógica de controladores para autenticación, usuarios, carreras, estadísticas y tests
  - `middleware/` - Middlewares personalizados (por ejemplo, autenticación)
  - `routes/` - Definición de rutas de la API
- `prisma/` - Definición del esquema de base de datos Prisma
  - `schema.prisma` - Esquema de la base de datos
- `scripts/` - Scripts utilitarios (por ejemplo, importación de datos)
- `.env` - Variables de entorno (no compartir este archivo públicamente)
- `package.json` - Dependencias y scripts de npm
- `BS_TECNOMATH_DANI.sql` - Script SQL de la base de datos
- `tmp_programas.csv` - Archivo CSV temporal para importación de datos

## Instalación

1. Clona el repositorio y entra en la carpeta del backend:
   ```sh
   git clone <repo_url>
   cd Nuevo_back
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Configura el archivo `.env` con tus variables de entorno (por ejemplo, la URL de la base de datos).
4. Ejecuta las migraciones de la base de datos con Prisma:
   ```sh
   npx prisma migrate dev
   ```
5. (Opcional) Importa datos iniciales usando los scripts en la carpeta `scripts/`.

## Uso

Para iniciar el servidor en modo desarrollo:
```sh
npm run dev
```

El servidor se ejecutará en el puerto especificado en tu archivo `.env` (por defecto, 3000).

## Scripts útiles
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm start` - Inicia el servidor en modo producción
- `npx prisma studio` - Abre Prisma Studio para explorar la base de datos

## Endpoints principales
- `/api/auth` - Autenticación de usuarios
- `/api/users` - Gestión de usuarios
- `/api/careers` - Gestión de carreras
- `/api/stats` - Estadísticas
- `/api/tests` - Tests

## Tecnologías utilizadas
- Node.js
- Express
- Prisma ORM
- PostgreSQL (o la base de datos configurada en `.env`)

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-feature`)
3. Haz commit de tus cambios (`git commit -am 'Agrega nueva feature'`)
4. Haz push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT.
