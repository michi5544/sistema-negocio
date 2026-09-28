# Guía de Implementación — Sistema Negocio

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| ORM | Sequelize |
| Base de datos | MySQL |
| Escritorio | Electron + electron-builder |
| Auth | JWT + bcryptjs |

---

## Estructura del proyecto

```
sistema-negocio/
├── backend/
│   ├── config/
│   │   ├── db.js               # Conexión Sequelize
│   │   ├── initDatabase.js     # Crea la BD si no existe
│   │   └── seed.js             # Crea el admin por defecto
│   ├── middlewares/
│   │   ├── auth.middleware.js  # Verifica JWT
│   │   └── authorizeRole.js   # Verifica rol (admin / employee)
│   ├── models/
│   │   ├── index.js            # Registra todos los modelos
│   │   ├── users.model.js
│   │   ├── customers.model.js
│   │   ├── product.model.js
│   │   ├── ambiente.model.js
│   │   ├── mesa.model.js
│   │   ├── sale.model.js
│   │   ├── sale_details.model.js
│   │   ├── comanda.model.js
│   │   ├── detalle_comanda.model.js
│   │   └── caja.model.js
│   ├── routes/                 # Un archivo por recurso
│   ├── server.js               # Punto de entrada del backend
│   └── .env                   # Credenciales (no subir a git)
├── frontend/
├── electron/
│   ├── main.js                 # Proceso principal de Electron
│   ├── afterPack.js            # Copia el backend al instalador
│   ├── db.config.example.json  # Plantilla de config post-instalación
│   └── package.json
└── BD/
    └── DATA BASE.sql           # Esquema de referencia
```

---

## Requisitos previos

- **Node.js** LTS — https://nodejs.org
- **MySQL** 8+ (o XAMPP con MariaDB)
- **Yarn** (para Electron):
  ```bash
  corepack enable
  corepack prepare yarn@stable --activate
  ```

---

## Instalación en modo desarrollo

### 1. Clonar el repositorio

> Clonar en una ruta local simple, **fuera de OneDrive / Google Drive**.
> Ejemplo: `C:\Proyectos\sistema-negocio`

```bash
git clone <url-del-repo>
cd sistema-negocio
```

### 2. Configurar el backend

```bash
cd backend
npm install
cp .env.example .env
```

Editar `backend/.env` con los datos reales de MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=tu_contraseña
DB_NAME=sistema_negocio
JWT_SECRET=una_clave_secreta_larga
PORT=3000
```

> La base de datos **se crea automáticamente** al iniciar el backend.
> No es necesario ejecutar el script SQL manualmente.

### 3. Iniciar el backend

```bash
npm run dev
```

En el primer arranque la consola mostrará:

```
Base de datos "sistema_negocio" verificada.
Tablas sincronizadas
======================================
  Usuario admin creado por defecto:
  Email   : admin@sistema.com
  Password: admin123
  Cambia la contraseña después del primer login.
======================================
Servidor corriendo en el puerto 3000
SERVER_READY
```

### 4. Configurar e iniciar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173` en el navegador.

---

## Primer login

| Campo | Valor |
|-------|-------|
| Email | `admin@sistema.com` |
| Contraseña | `admin123` |

> Cambiar la contraseña desde el módulo de Usuarios después del primer acceso.

---

## Roles y permisos

### Admin
Acceso completo (CRUD) a todos los módulos.

### Employee
Acceso restringido según la siguiente tabla:

| Módulo | GET | POST | PUT | DELETE |
|--------|-----|------|-----|--------|
| Productos | ✓ | ✗ | ✗ | ✗ |
| Clientes | ✓ | ✗ | ✗ | ✗ |
| Ventas | ✓ | ✓ | ✗ | ✗ |
| Detalle Ventas | ✓ | ✓ | ✓ | ✓ |
| Mesas | ✓ | ✗ | ✓ | ✗ |
| Comandas | ✓ | ✓ | ✓ | ✗ |
| Detalle Comanda | ✓ | ✓ | ✓ | ✗ |
| Usuarios | ✗ | ✗ | ✗ | ✗ |
| Ambientes | ✗ | ✗ | ✗ | ✗ |

---

## Endpoints de la API

Todas las rutas requieren header `Authorization: Bearer <token>` excepto `/api/login`.

### Autenticación
| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/api/login` | Público |

### Usuarios `/api/users`
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/` | Admin |
| GET | `/:id` | Admin |
| POST | `/` | Admin |
| PUT | `/:id` | Admin |
| DELETE | `/:id` | Admin |

### Productos `/api/products`
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/` | Admin, Employee |
| GET | `/:id` | Admin, Employee |
| POST | `/` | Admin |
| PUT | `/:id` | Admin |
| DELETE | `/:id` | Admin |

### Clientes `/api/customers`
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/` | Admin, Employee |
| GET | `/:id` | Admin, Employee |
| POST | `/` | Admin |
| PUT | `/:id` | Admin |
| DELETE | `/:id` | Admin |

### Ventas `/api/sales`
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/` | Admin, Employee |
| GET | `/sp` | Admin, Employee |
| GET | `/:id` | Admin, Employee |
| POST | `/` | Admin, Employee |
| PUT | `/:id` | Admin |
| DELETE | `/:id` | Admin |

### Detalle de Ventas `/api/sale-details`
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/` | Admin, Employee |
| POST | `/` | Admin, Employee |
| PUT | `/:id` | Admin, Employee |
| DELETE | `/:id` | Admin, Employee |

### Mesas `/api/mesa`
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/` | Admin, Employee |
| GET | `/:id` | Admin, Employee |
| POST | `/` | Admin |
| PUT | `/:id` | Admin, Employee |
| DELETE | `/:id` | Admin |

### Ambientes `/api/ambiente`
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/` | Admin |
| POST | `/` | Admin |
| DELETE | `/:id` | Admin |

### Comandas `/api/comandas`
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/` | Admin, Employee |
| GET | `/:id` | Admin, Employee |
| POST | `/` | Admin, Employee |
| PUT | `/:id` | Admin, Employee |
| DELETE | `/:id` | Admin |

Cuerpo para crear/actualizar una comanda:
```json
{
  "id_mesa": 1,
  "estado": "Pendiente",
  "productos": [
    { "id_producto": 3, "cantidad": 2 },
    { "id_producto": 7, "cantidad": 1 }
  ]
}
```

### Detalle de Comanda `/api/detalle-comanda`
| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/` | Admin, Employee |
| GET | `/:id` | Admin, Employee |
| POST | `/` | Admin, Employee |
| PUT | `/:id` | Admin, Employee |
| DELETE | `/:id` | Admin |

### Caja `/api/caja`
| Método | Ruta | Acceso |
|--------|------|--------|
| (ver rutas implementadas) | — | Admin |

---

## Secuencia de arranque del backend

```
initDatabase()          → Crea BD si no existe (mysql2 sin seleccionar BD)
  ↓
sequelize.sync()        → Crea/verifica todas las tablas (models/index.js)
  ↓
seedAdmin()             → Crea admin por defecto si users está vacía
  ↓
app.listen(3000)        → Imprime SERVER_READY
```

---

## Generar el ejecutable (.exe)

### Antes de compilar

Verificar que `backend/.env` tenga las credenciales de producción:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=contraseña_produccion
DB_NAME=sistema_negocio
JWT_SECRET=clave_segura_produccion
```

> El `.env` queda empaquetado dentro del instalador automáticamente.

### Compilar

```bash
cd electron
yarn install       # solo la primera vez
yarn dist
```

El proceso:
1. Compila el frontend (`npm run build`)
2. Copia `backend/` completo (con `node_modules` y `.env`) dentro del instalador mediante `afterPack.js`
3. Genera el instalador en `release/`

### Resultado

```
release/
├── MiProyecto Setup 1.0.0.exe   ← instalador para distribuir
└── win-unpacked/                 ← versión descomprimida (solo para pruebas)
```

### En la máquina del usuario final

El usuario necesita tener **MySQL instalado y corriendo**. La app:
- Crea la base de datos `sistema_negocio` automáticamente si no existe
- Crea todas las tablas
- Crea el usuario admin por defecto en el primer arranque

Si el usuario tiene una contraseña de MySQL diferente a la empaquetada, puede crear un archivo `db.config.json` **junto al `.exe`** (copiar de `db.config.example.json`):

```json
{
  "DB_HOST": "localhost",
  "DB_PORT": "3306",
  "DB_USER": "root",
  "DB_PASS": "su_contraseña_mysql",
  "DB_NAME": "sistema_negocio",
  "JWT_SECRET": "sistema_negocio_secret"
}
```

Esto sobreescribe las credenciales empaquetadas **sin necesidad de recompilar**.

---

## Prioridad de configuración de credenciales

```
db.config.json (junto al .exe)   ← mayor prioridad
      ↓ si no existe
  backend/.env (dentro del instalador)
      ↓ si no existe
  defaults de main.js (localhost, root, sin contraseña)
```

---

## Solución de problemas comunes

| Problema | Causa probable | Solución |
|----------|---------------|----------|
| Pantalla en blanco en Electron | `BrowserRouter` en vez de `HashRouter`, o `base: '/'` en Vite | Usar `HashRouter` y `base: './'` en `vite.config.js` |
| `Cannot find module 'express'` | `node_modules` del backend no existe | Correr `npm install` en `backend/` antes de `yarn dist` |
| `EBUSY: resource busy` al compilar | App corriendo en segundo plano | Cerrar la app desde el Administrador de Tareas, borrar `release/` |
| Error de conexión a MySQL | Credenciales incorrectas o MySQL no corre | Verificar `.env` o `db.config.json`, iniciar el servicio MySQL |
| `Access denied for user` | Contraseña de MySQL no coincide | Editar `DB_PASS` en `backend/.env` o en `db.config.json` junto al `.exe` |
| Tablas no creadas | Modelos no importados antes de `sync()` | Verificar que `models/index.js` incluya todos los modelos |
