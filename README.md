# Sistema Negocio - Backend/Frontend

1. Instalar dependencias `npm install`
2. Clonar el archivo `.env.example` y renombrarlo a `.env`
3. Cambiar las variables de entorno acorde a tu configuración
4. Correr el servidor y el cliente `npm run dev`
5. Verificar que esta instalado express en caso contrario ejecutar en consola comando (verificar documentacion actualizada en sitio oficial)

---

# Empaquetado como ejecutable de escritorio (Electron)

Este proyecto incluye una carpeta `electron/` que permite generar un instalador `.exe` (Windows) que empaqueta el backend (Node/Express) y el frontend (React/Vite) en una sola aplicación de escritorio.

##  IMPORTANTE: no usar OneDrive ni rutas sincronizadas

Clona el proyecto en una ruta local simple, **fuera de OneDrive, Google Drive o Dropbox** (por ejemplo `C:\Proyectos\sistema-negocio`). Carpetas sincronizadas en la nube causan errores al copiar `node_modules` durante el empaquetado (archivos "placeholder" no descargados).

## Requisitos previos

- **Node.js** (LTS) instalado: https://nodejs.org
- **Yarn** instalado vía Corepack (viene con Node):
  ```bash
  corepack enable
  corepack prepare yarn@stable --activate
  ```
  Verifica con `yarn --version`.

## Estructura del proyecto

```
sistema-negocio/
├── backend/
├── frontend/
└── electron/
```

## Pasos para un desarrollador que clona el proyecto por primera vez

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd sistema-negocio
```

### 2. Configurar y correr el backend (modo desarrollo)

```bash
cd backend
npm install
```

Clona `.env.example` y renómbralo a `.env`, ajustando las variables (credenciales de MySQL, JWT secret, puerto, etc.):

```bash
cp .env.example .env
```

Levanta el backend en modo desarrollo:

```bash
npm run dev
```

### 3. Configurar y correr el frontend (modo desarrollo)

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173` (o el puerto que indique Vite) en el navegador para desarrollar normalmente.

> En este punto, el desarrollo diario es exactamente igual que antes — Electron no interviene mientras trabajas con `npm run dev`.

### 4. Instalar dependencias de Electron (solo cuando necesites generar el ejecutable)

```bash
cd electron
yarn install
```

### 5. Probar la app empaquetada en modo desarrollo

Antes de generar el instalador, puedes correr la app dentro de Electron para verificar que todo funcione:

```bash
# Build del frontend (Electron carga los archivos estáticos, no el servidor de Vite)
cd ../frontend
npm run build

# Levantar Electron
cd ../electron
yarn start
```

Esto abre una ventana de escritorio que:
- Carga el frontend ya compilado (`frontend/dist`)
- Levanta el backend automáticamente como proceso interno (usando el Node embebido de Electron)
- Conecta al backend en `http://localhost:3000`

### 6. Generar el instalador `.exe`

```bash
cd electron
yarn dist
```

Este comando:
1. Builda el frontend (`npm run build`)
2. Empaqueta el backend completo (incluyendo `node_modules` y `.env`) y el frontend dentro de la app
3. Genera los archivos de salida en `sistema-negocio/release/`

### 7. Resultado

En `release/` encontrarás:

- **`MiProyecto Setup 1.0.0.exe`** → Este es el instalador final, **un solo archivo**. Es el que se distribuye a los usuarios finales. Al ejecutarlo, instala la app en la PC del usuario (menú de inicio, accesos directos, etc.).
- `win-unpacked/` → versión "descomprimida" de la app, útil solo para pruebas rápidas durante desarrollo (requiere toda la carpeta, no solo el `.exe`).

## Notas técnicas importantes

- **Backend embebido**: el backend corre dentro de la propia app empaquetada usando el runtime de Node de Electron (`ELECTRON_RUN_AS_NODE=1`), por lo que el usuario final **no necesita tener Node.js instalado**.
- **Base de datos MySQL**: el `.env` empaquetado define la conexión a MySQL. Si la app se instalará en una máquina distinta a la de desarrollo, esa máquina necesita tener MySQL accesible (local o remoto) con las credenciales correctas en el `.env`.
- **Rutas del frontend**: el router usa `HashRouter` (no `BrowserRouter`) porque la app carga los archivos vía `file://`, lo cual es incompatible con rutas absolutas tipo servidor.
- **`vite.config.js`** debe tener `base: './'` para que los assets compilados usen rutas relativas.

## Solución de problemas comunes

| Problema | Causa probable | Solución |
|---|---|---|
| Pantalla en blanco al abrir Electron | `base: '/'` en `vite.config.js`, o `BrowserRouter` en vez de `HashRouter` | Cambiar a `base: './'` y `HashRouter` |
| `Cannot find module 'express'` al abrir el `.exe` | `node_modules` del backend no se copió | Verificar `backend/node_modules` existe y correr `npm install` antes de `yarn dist` |
| `EBUSY: resource busy or locked` al hacer `yarn dist` | La app sigue corriendo en segundo plano | Cerrar la app/proceso desde el Administrador de Tareas y volver a borrar `release/` |
| Solo se copia una carpeta del backend (ej. `routes`) | electron-builder respeta `.gitignore` del backend al copiar `extraResources` | El hook `afterPack.js` ya resuelve esto copiando el backend completo con `fs.cp` |
